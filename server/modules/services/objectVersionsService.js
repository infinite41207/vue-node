const ObjectVersions = require('@registers/objectVersions/models')
const ObjectVersioningSettings = require('@registers/objectVersioningSettings/models')
const logger = require('@logging/logger')

module.exports = {
  async onChangeHandler(objectModel, objectId, changeMode, userId) {
    try {
      const existVersioning = await ObjectVersioningSettings.findOne({ where: { objectType: objectModel.name } })

      if (existVersioning) {
        if (existVersioning.versioningMethod === 'all' || existVersioning.versioningMethod === changeMode) {
          let include = prepareIncludes(objectModel)

          await objectModel.findByPk(objectId, { include }).then(async (object) => {
            if (object) {
              const versionInfo = {
                objectId,
                objectData: JSON.stringify(object),
                objectType: objectModel.name,
                userId,
                description: changeMode,
              }

              await ObjectVersions.create(versionInfo).catch((err) => {
                console.error(err)
              })
            }
          })
        }
      }
    } catch (error) {
      logger.error(`Error in ${objectModel.options.name.plural} objectVersionsService onChangeHandler`, { meta: error })
    }
  },

  async addChanges(objectData, req) {
    let changesData = { ...objectData }

    if (req.user) {
      changesData.userId = req.user.id
    }

    await ObjectVersions.create(changesData).catch((err) => {
      console.error(err)
    })
  },
}

function prepareIncludes(object) {
  let include = []

  if (object.associations) {
    for (let as in object.associations) {
      let model = object.associations[as].target

      if (object.associations[as].isSingleAssociation) {
        let attributes = ['id', 'presentation']

        if (object.associations[as].source.rawAttributes.name) {
          attributes.push('name')
        }

        include.push({ model, as, attributes }) // include field ref data
      } else {
        const count = include.push({ model, as }) // include tables

        if (model.associations) {
          include[count - 1].include = []

          for (let tFieldAs in model.associations) {
            let tFieldModel = model.associations[tFieldAs].target

            if (model.associations[tFieldAs].isSingleAssociation) {
              let tFieldAttributes = ['id', 'presentation']

              if (model.associations[tFieldAs].target.rawAttributes.name) {
                tFieldAttributes.push('name')
              }

              include[count - 1].include.push({ model: tFieldModel, as: tFieldAs, attributes: tFieldAttributes }) // include table field ref data
            }
          }
        }
      }
    }
  }

  return include
}
