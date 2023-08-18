const ObjectModel = require('../models')
const { Op } = require('sequelize')
const httpStatus = require('http-status-codes')
const seederService = require('@services/seederService')
const { getUserAccessRoles } = require('@services/userAccessService')

const objectDescription = 'Navigation'

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    const lang = req.query.lang
    const needTranslate = lang && lang !== 'pl'

    let userRoles

    if (!req.user) {
      filter.accessRoleId = { [Op.or]: [{ [Op.in]: [] }, { [Op.eq]: null }] }
    } else {
      if (req.user?.fullRights !== true) {
        userRoles = await getUserAccessRoles(req.user?.id).catch((error) => {
          console.error(error)
        })

        if (userRoles) {
          const accessRoleId = userRoles.map((el) => el.userRoleId)
          filter.accessRoleId = { [Op.in]: accessRoleId }
        } else {
          filter.accessRoleId = { [Op.in]: [] }
        }
      }
    }

    let list = await ObjectModel.findAll({ where: filter, order: ['sequence'] }).catch((err) => {
      console.error(err)
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
    })

    if (list) {
      list = JSON.stringify(list)
      list = JSON.parse(list)

      if (userRoles) {
        for (let navItem of list) {
          const navRole = userRoles.find((el) => el.userRoleId === navItem.accessRoleId)

          if (navRole) {
            navItem.isReadOnly = navRole.canModify !== true
          }
        }
      }

      let result = []
      formTableToTree(list, result, null, needTranslate, lang)
      res.status(httpStatus.StatusCodes.OK).send(result)
    }
  },

  async findById(req, res, next) {
    let item = await ObjectModel.findByPk(req.params.id)

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async update(req, res, next) {
    const navDataTree = req.body

    try {
      let newNav = []
      formTreeToTable(navDataTree, newNav)

      let prevNav = await ObjectModel.findAll()

      prevNav = JSON.stringify(prevNav)
      prevNav = JSON.parse(prevNav)

      if (prevNav.length > 0) {
        for (let prevNavItem of prevNav) {
          let sResult = newNav.find((el) => el.id === prevNavItem.id)

          if (!sResult) {
            await ObjectModel.destroy({ where: { id: prevNavItem.id } })
          }
        }

        for (let newNavItem of newNav) {
          let sResult = prevNav.find((el) => el.id === newNavItem.id)

          if (!sResult) {
            await ObjectModel.create(newNavItem).catch((error) => {
              throw error
            })
          } else {
            await ObjectModel.update(newNavItem, { where: { id: newNavItem.id } }).catch((error) => {
              throw error
            })
          }
        }
      } else {
        for (let newNavItem of newNav) {
          await ObjectModel.create(newNavItem).catch((error) => {
            throw error
          })
        }
      }

      seederService.updateInitialData(ObjectModel, 'navigation')

      res.status(200).send({ message: 'OK' })
    } catch (error) {
      res.status(400).send({ message: error })
    }
  },
}

function formTableToTree(navigation, resultChilds, parentId = null, needTranslate, lang) {
  let lvlRoutes = navigation.filter((el) => {
    return el.parentId === parentId
  })

  for (let lvlRote of lvlRoutes) {
    let length = resultChilds.push({ ...lvlRote, childs: [] })
    if (resultChilds[length - 1].lang !== null) {
      resultChilds[length - 1].lang = JSON.parse(resultChilds[length - 1].lang)
      if (needTranslate === true) {
        for (let langField of Object.keys(lang)) {
          if (resultChilds[length - 1][langField]) {
            if (lang[langField][lang] && lang[langField][lang] !== '') {
              resultChilds[length - 1][langField] = lang[langField][lang]
            }
          }
        }
      }
    }
    formTableToTree(navigation, resultChilds[length - 1].childs, lvlRote.id)
  }
}

function formTreeToTable(navItems, result) {
  for (let navItem of navItems) {
    let { childs, lang, ...itemData } = navItem
    if (lang !== null) {
      lang = JSON.stringify(lang)
    }
    result.push({ ...itemData, lang })
    formTreeToTable(childs, result)
  }
}
