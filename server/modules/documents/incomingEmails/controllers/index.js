const { Op } = require('sequelize')

const Sequelize = require('@database/dbConnection')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const IncomingEmail = require('../models/index')
const IncomingEmailLink = require('../models/incomingEmailLink')
const IncomingEmailsAttachment = require('../models/incomingEmailAttachment')
const Counterparty = require('@catalogs/counterparties/models')
const moment = require('moment')

const config = require('config')

module.exports = {
  async findAll(req, res, next) {
    const { emailAccountId, page, limit } = req.query
    const box = JSON.parse(req.query.box || '{}')

    const filter = JSON.parse(req.query.filter || '{}')
    filter.emailAccountId = emailAccountId
    filter.mailboxId = box.id
    filter.deleted = false

    if (filter.labels) {
      filter.labels = { [Op.iLike]: `%${filter.labels}%` }
    }

    if (filter.from) {
      filter.from = { [Op.iLike]: `%${filter.from}%` }
    }

    if (filter.subject) {
      filter.subject = { [Op.iLike]: `%${filter.subject}%` }
    }

    if (filter.body) {
      filter.html = { [Op.iLike]: `%${filter.body}%` }

      delete filter.body
    }

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.date = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    if (filter.searchStr) {
      filter[Op.or] = []

      filter[Op.or].push({ from: { [Op.iLike]: `%${filter.searchStr}%` } })
      filter[Op.or].push({ subject: { [Op.iLike]: `%${filter.searchStr}%` } })
      filter[Op.or].push({ html: { [Op.iLike]: `%${filter.searchStr}%` } })

      delete filter.searchStr
    }

    if (emailAccountId) {
      let offset = 0 + (page - 1) * limit
      let incomingEmails = await IncomingEmail.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        attributes: ['id', 'uid', 'from', 'to', 'flags', 'labels', 'date', 'createdAt', 'subject', 'attachmentsAtHardDrive'],
        include: [
          { model: IncomingEmailLink, as: 'links' },
          { model: IncomingEmailsAttachment, as: 'files' },
          { model: Counterparty, as: 'counterparty' },
        ],
        order: [['uid', 'DESC']],
      }).catch((error) => {
        console.error(error)
        return res.status(400).send({ message: error })
      })

      if (incomingEmails) {
        incomingEmails = JSON.stringify(incomingEmails)
        incomingEmails = JSON.parse(incomingEmails)

        for (let incomingEmail of incomingEmails.rows) {
          incomingEmail.flags = JSON.parse(incomingEmail.flags)
          incomingEmail.labels = JSON.parse(incomingEmail.labels || '[]')
          incomingEmail.from = JSON.parse(incomingEmail.from)
          incomingEmail.to = JSON.parse(incomingEmail.to)

          if (incomingEmail.cc) {
            incomingEmail.cc = JSON.parse(incomingEmail.cc)
          }

          incomingEmail.unseen = true
          if (incomingEmail.flags.length > 0) {
            if (incomingEmail.flags.includes('\\Seen')) {
              incomingEmail.unseen = false
            }
          }

          if (incomingEmail.links.length > 0) {
            incomingEmail.hasLinks = true
            if (incomingEmail.links.length > 1) {
              incomingEmail.linkType = 'common'
            } else {
              incomingEmail.linkType = incomingEmail.links[0].documentType
            }
          } else {
            incomingEmail.hasLinks = false
            incomingEmail.linkType = ''
          }
        }

        res.status(200).send({ messages: incomingEmails.rows, total: incomingEmails.count })
      } else {
        console.log(err)
        res.status(400).send({
          message: 'Bad request',
        })
      }
    }
  },

  async findById(req, res, next) {
    let incomingEmail = await IncomingEmail.findByPk(req.params.id, {
      include: [
        { model: IncomingEmailsAttachment, as: 'files' },
        { model: Counterparty, as: 'counterparty' },
      ],
    })

    if (incomingEmail) {
      incomingEmail = JSON.stringify(incomingEmail)
      incomingEmail = JSON.parse(incomingEmail)

      incomingEmail.flags = JSON.parse(incomingEmail.flags)
      incomingEmail.labels = JSON.parse(incomingEmail.labels || '[]')

      incomingEmail.unseen = true
      if (incomingEmail.flags.length > 0) {
        if (incomingEmail.flags.includes('\\Seen')) {
          incomingEmail.unseen = false
        }
      }

      incomingEmail.from = JSON.parse(incomingEmail.from)
      incomingEmail.to = JSON.parse(incomingEmail.to)

      if (incomingEmail.cc) {
        incomingEmail.cc = JSON.parse(incomingEmail.cc)
      }

      if (incomingEmail.attachmentsAtHardDrive === true) {
        incomingEmail.attachments = []
        for (let attachment of incomingEmail.files) {
          incomingEmail.attachments.push({
            id: attachment.id,
            filename: attachment.originalname,
            size: attachment.size,
            contentType: attachment.type,
            checksum: attachment.checksum,
            contentDisposition: attachment.contentDisposition,
          })
        }
      } else {
        const attachments = JSON.parse(incomingEmail.attachments)

        incomingEmail.attachments = []
        for (let attachment of attachments) {
          incomingEmail.attachments.push({
            id: null,
            filename: attachment.filename,
            size: attachment.size,
            contentType: attachment.contentType,
            checksum: attachment.checksum,
            contentDisposition: attachment.contentDisposition,
          })
        }
      }

      res.status(200).send(incomingEmail)
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async findByUid(req, res, next) {
    const { emailAccountId, mailboxId } = req.query

    let incomingEmails = await IncomingEmail.findAll({
      where: { emailAccountId, uid: req.params.id, mailboxId },
    })

    if (incomingEmails.length > 0) {
      let incomingEmail = incomingEmails[0]

      incomingEmail = JSON.stringify(incomingEmail)
      incomingEmail = JSON.parse(incomingEmail)

      incomingEmail.flags = JSON.parse(incomingEmail.flags)
      incomingEmail.labels = JSON.parse(incomingEmail.labels || '[]')

      incomingEmail.unseen = true
      if (incomingEmail.flags.length > 0) {
        if (incomingEmail.flags.includes('\\Seen')) {
          incomingEmail.unseen = false
        }
      }

      incomingEmail.from = JSON.parse(incomingEmail.from)
      incomingEmail.to = JSON.parse(incomingEmail.to)

      if (incomingEmail.cc) {
        incomingEmail.cc = JSON.parse(incomingEmail.cc)
      }

      incomingEmail.attachments = JSON.parse(incomingEmail.attachments)
      res.status(200).send(incomingEmail)
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async setFlag(req, res, next) {
    const { emailAccountId, emailUid, flag } = req.body

    await IncomingEmail.findAll({
      where: { emailAccountId, uid: emailUid },
    })
      .then(async (incomingEmails) => {
        if (incomingEmails.length > 0) {
          try {
            for (let incomingEmail of incomingEmails) {
              let flags = JSON.parse(incomingEmail.flags)

              if (!flags.includes(`\\${flag}`)) {
                flags.push(`\\${flag}`)
              }

              flags = JSON.stringify(flags)
              await incomingEmail.update({ flags }).catch((error) => {
                throw error
              })
            }
            res.status(200).send(true)
          } catch (error) {
            console.error(error)
            res.status(400).send(error)
          }
        } else {
          res.status(400).send({ message: 'Email account not found' })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async setLabel(req, res, next) {
    const { emailAccountId, emailId, label, setLabel } = req.body

    await IncomingEmail.findAll({
      where: { emailAccountId, id: emailId },
    })
      .then(async (incomingEmails) => {
        if (incomingEmails.length > 0) {
          try {
            for (let incomingEmail of incomingEmails) {
              let labels = []

              if (incomingEmail.labels !== null) {
                labels = JSON.parse(incomingEmail.labels)
              }

              if (setLabel === true) {
                if (!labels.includes(`${label}`)) {
                  labels.push(`${label}`)
                }
              } else {
                const labelIndex = labels.indexOf(`${label}`)
                if (labelIndex > -1) {
                  labels.splice(labelIndex, 1)
                }
              }

              labels = JSON.stringify(labels)
              await incomingEmail.update({ labels }).catch((error) => {
                throw error
              })
            }
            res.status(200).send(true)
          } catch (error) {
            console.error(error)
            res.status(400).send(error)
          }
        } else {
          res.status(400).send({ message: 'Email account not found' })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async emailMove(req, res, next) {
    const { emailAccountId, emailUid, boxFrom, boxTo } = req.body

    boxFrom = JSON.parse(boxFrom)
    boxTo = JSON.parse(boxTo)

    await IncomingEmail.findAll({
      where: { emailAccountId, uid: emailUid },
    })
      .then(async (incomingEmails) => {
        if (incomingEmails.length > 0) {
          try {
            for (let incomingEmail of incomingEmails) {
              await incomingEmail.update({ deleted: true }).catch((error) => {
                throw error
              })
            }
            res.status(200).send(true)
          } catch (error) {
            console.error(error)
            res.status(400).send(error)
          }
        } else {
          res.status(400).send({ message: 'Email account not found' })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async setSeen(req, res, next) {
    const { emailAccountId, emailUid } = req.body

    await IncomingEmail.findAll({
      where: { emailAccountId, uid: emailUid },
    })
      .then(async (incomingEmails) => {
        if (incomingEmails.length > 0) {
          try {
            for (let incomingEmail of incomingEmails) {
              let flags = JSON.parse(incomingEmail.flags)

              if (!flags.includes('\\Seen')) {
                flags.push('\\Seen')
              }

              flags = JSON.stringify(flags)
              await incomingEmail.update({ flags }).catch((error) => {
                throw error
              })
            }
            res.status(200).send(true)
          } catch (error) {
            console.error(error)
            res.status(400).send(error)
          }
        } else {
          res.status(400).send({ message: 'Email account not found' })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async setUnseen(req, res, next) {
    const { emailAccountId, emailUid } = req.body

    let incomingEmails = await IncomingEmail.findAll({
      where: { emailAccountId, uid: emailUid },
    })

    if (incomingEmails.length > 0) {
      try {
        for (let incomingEmail of incomingEmails) {
          let flags = JSON.parse(incomingEmail.flags)

          const flagIndex = flags.indexOf('\\Seen')
          if (flagIndex > -1) {
            flags.splice(flagIndex, 1)
          }

          flags = JSON.stringify(flags)
          await incomingEmail.update({ flags }).catch((error) => {
            throw error
          })
        }

        res.status(200).send(true)
      } catch (error) {
        return res.status(400).send(error)
      }
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async update(req, res, next) {
    const existEmail = await IncomingEmail.findByPk(req.params.id)

    if (existEmail) {
      const updateData = req.body

      await existEmail
        .update(updateData)
        .then((updatedEmail) => {
          res.status(200).send(updatedEmail)
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: 'E-mail not found' })
    }
  },

  async getAttachmetContent(req, res, next) {
    const { emailId, filename, checksum } = req.body

    await IncomingEmail.findByPk(emailId, {
      attributes: ['attachments'],
    })
      .then((incomingEmail) => {
        if (incomingEmail) {
          const attachments = JSON.parse(incomingEmail.attachments)

          const attachment = attachments.find((el) => {
            return el.checksum === checksum
          })

          if (attachment) {
            res.status(200).send(attachment.content)
          } else {
            res.status(400).send({ message: 'Attachment not found' })
          }
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: 'Email not found' })
      })
  },

  async getFile(req, res) {
    await IncomingEmailsAttachment.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (err) => {
          if (err) {
            console.error(err)
          }
        })
      })
      .catch((err) => {
        console.error(err)
        res.status(501).send({ message: err })
      })
  },

  async getFiles(req, res) {
    await IncomingEmailsAttachment.findAll({ where: { emailId: req.query.emailId } })
      .then((result) => {
        let files = []

        for (let file of result) {
          files.push({
            id: file.id,
            filename: file.originalname,
            size: file.size,
            contentType: file.type,
            checksum: file.checksum,
            contentDisposition: file.contentDisposition,
          })
        }

        res.status(200).send(files)
      })
      .catch((err) => {
        console.error(err)
        res.status(501).send({ message: err })
      })
  },

  async getLinkedDocs(req, res) {
    const { emailId, emailUid, emailAccountId } = JSON.parse(req.query.filter || '{}')

    if (emailId || emailUid) {
      const where = emailId ? { emailId } : { emailUid, emailAccountId }

      await IncomingEmailLink.findAll({ where })
        .then(async (linkedDocs) => {
          if (linkedDocs) {
            let result = []

            linkedDocs = JSON.stringify(linkedDocs)
            linkedDocs = JSON.parse(linkedDocs)

            for (let linkedDoc of linkedDocs) {
              const objectType = linkedDoc.documentType.charAt(0).toUpperCase() + linkedDoc.documentType.slice(1)

              const Model = Sequelize.models[objectType]

              if (Model) {
                const objectData = await Model.findOne({ where: { id: linkedDoc.documentId } })

                if (objectData) {
                  result.push({
                    id: linkedDoc.id,
                    documentType: objectType,
                    documentId: linkedDoc.documentId,
                    createdAt: moment(objectData.createdAt).format('DD.MM.YYYY HH:mm:ss'),
                    numberStr: objectData.numberStr ? objectData.numberStr : objectData.number,
                    markedToDelete: objectData.markedToDelete ? objectData.markedToDelete : false,
                  })
                }
              }
            }

            res.status(200).send(result)
          }
        })
        .catch((error) => {
          console.error(error)
          res.status(400).send({ message: 'Email not found' })
        })
    }
  },

  async deleteLinkedDoc(req, res) {
    const emailLink = await IncomingEmailLink.findByPk(req.params.id)

    if (emailLink) {
      await emailLink
        .destroy(req.params.id)
        .then(() => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((error) => {
          console.error(error)
          res.status(400).send({ message: error })
        })
    } else {
      res.status(400).send({ message: `${req.params.id} not found` })
    }
  },
}
