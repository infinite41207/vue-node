const OutgoingEmail = require('../models/index')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const OutgoingEmailLink = require('../models/outgoingEmailLink')
const nodemailer = require('nodemailer')
const cryptoGen = require('@common/auth/cryptoGen')
const logger = require('@logging/logger')
const Sequelize = require('@database/dbConnection')
const Counterparty = require('@catalogs/counterparties/models')
const uuidlib = require('uuid')
const moment = require('moment')
const { Op } = require('sequelize')

module.exports = {
  async getAll(req, res, next) {
    const { emailAccountId, page, limit, addinParams } = req.query
    const filter = JSON.parse(req.query.filter || '{}')
    const box = JSON.parse(req.query.box || '{}')

    filter.fromId = emailAccountId
    filter.markedToDelete = false

    if (filter.labels) {
      filter.labels = { [Op.iLike]: `%${filter.labels}%` }
    }

    if (filter.subject) {
      filter.subject = { [Op.iLike]: `%${filter.subject}%` }
    }

    if (filter.body) {
      filter.body = { [Op.iLike]: `%${filter.body}%` }
    }

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.date = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    if (filter.searchStr) {
      filter[Op.or] = [{ subject: { [Op.iLike]: `%${filter.searchStr}%` } }, { to: { [Op.iLike]: `%${filter.searchStr}%` } }, { body: { [Op.iLike]: `%${filter.searchStr}%` } }]
      delete filter.searchStr
    }

    if (emailAccountId) {
      let offset = 0 + (page - 1) * limit

      let outgoingEmails = await OutgoingEmail.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        attributes: ['id', 'to', 'flags', 'labels', 'date', 'createdAt', 'subject'],
        include: [
          { model: EmailAccount, attributes: ['id', 'name'], as: 'from' },
          { model: OutgoingEmailLink, as: 'links' },
          { model: Counterparty, as: 'counterparty' },
        ],
        order: [['id', 'DESC']],
      }).catch((error) => {
        console.error(error)
        return res.status(400).send({ message: error })
      })

      if (outgoingEmails) {
        outgoingEmails = JSON.stringify(outgoingEmails)
        outgoingEmails = JSON.parse(outgoingEmails)

        for (let outgoingEmail of outgoingEmails.rows) {
          outgoingEmail.flags = JSON.parse(outgoingEmail.flags)
          outgoingEmail.labels = JSON.parse(outgoingEmail.labels || '[]')

          if (outgoingEmail.links.length > 0) {
            outgoingEmail.hasLinks = true
            if (outgoingEmail.links > 1) {
              outgoingEmail.linkType = 'common'
            } else {
              outgoingEmail.linkType = outgoingEmail.links[0].documentType
            }
          } else {
            outgoingEmail.hasLinks = false
            outgoingEmail.linkType = ''
          }
        }

        res.status(200).send({ messages: outgoingEmails.rows, total: outgoingEmails.count })
      } else {
        console.error(err)
        res.status(400).send({
          message: 'Bad request',
        })
      }
    }
  },

  async findById(req, res, next) {
    let outgoingEmail = await OutgoingEmail.findByPk(req.params.id, { include: { model: Counterparty, as: 'counterparty' } })

    if (outgoingEmail) {
      outgoingEmail.flags = JSON.parse(outgoingEmail.flags)
      outgoingEmail.labels = JSON.parse(outgoingEmail.labels || '[]')

      const attachments = JSON.parse(outgoingEmail.attachments)

      outgoingEmail.attachments = []
      for (let attachment of attachments) {
        outgoingEmail.attachments.push({
          filename: attachment.filename,
          size: attachment.size,
          contentType: attachment.contentType,
          checksum: attachment.checksum,
          contentDisposition: attachment.contentDisposition,
        })
      }

      res.status(200).send(outgoingEmail)
    } else {
      res.status(400).send({ message: 'Email not found' })
    }
  },

  async create(req, res, next) {
    const outgoingEmailData = { ...req.body }

    outgoingEmailData.flags = JSON.stringify(outgoingEmailData.flags)
    outgoingEmailData.labels = JSON.stringify(outgoingEmailData.labels || '[]')
    outgoingEmailData.attachments = JSON.stringify(outgoingEmailData.attachments)
    outgoingEmailData.uuid = uuidlib.v4()

    await OutgoingEmail.create(outgoingEmailData)
      .then(async (newEmail) => {
        await sendEmail(newEmail)
        res.status(200).send(newEmail)
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: 'Email create error' })
      })
  },

  async createAtServer(outgoingEmailData) {
    outgoingEmailData.flags = JSON.stringify(outgoingEmailData.flags)
    outgoingEmailData.labels = JSON.stringify(outgoingEmailData.labels || '[]')
    outgoingEmailData.attachments = JSON.stringify(outgoingEmailData.attachments)

    let res = {}

    await OutgoingEmail.create(outgoingEmailData)
      .then(async (newEmail) => {
        await sendEmail(newEmail)

        res.email = newEmail
        res.message = 'Email was successfully sent'
      })
      .catch((error) => {
        console.error(error)
        res.email = null
        res.message = 'Email sending error'
      })

    return res
  },

  async update(req, res, next) {
    const existOutgoingEmail = await OutgoingEmail.findByPk(req.params.id)

    if (existOutgoingEmail) {
      const outgoingEmailData = { ...req.body }

      if (outgoingEmailData.flags) {
        outgoingEmailData.flags = JSON.stringify(outgoingEmailData.flags)
      }

      if (outgoingEmailData.labels) {
        outgoingEmailData.labels = JSON.stringify(outgoingEmailData.labels)
      }

      if (req.files) {
        outgoingEmailData.attachments = JSON.stringify(req.files)
      }

      await existOutgoingEmail
        .update(outgoingEmailData)
        .then((updatedOutgoingEmail) => {
          if (updatedOutgoingEmail) {
            res.status(200).send({ message: 'OK' })
          } else {
            res.status(400).send({ message: 'Email update error' })
          }
        })
        .catch((error) => {
          console.error(error)
          res.status(400).send({ message: 'Email update error' })
        })
    } else {
      res.status(400).send({ message: 'Email nie znaleziono' })
    }
  },

  async resendEmail(req, res) {
    const { emailId, emailAccountId } = req.body
    try {
      await OutgoingEmail.findAll({ where: { id: { [Op.in]: emailId }, fromId: emailAccountId } })
        .then(async (response) => {
          for (let email of response) {
            await sendEmail(email).catch((error) => {
              throw error
            })
          }

          res.status(200).send({ message: 'OK' })
        })
        .catch((error) => {
          throw error
        })
    } catch (error) {
      logger.error('Error while sending email', { meta: error })
      res.status(400).send({ message: error })
    }
  },

  async getLinkedDocs(req, res) {
    const { emailId } = JSON.parse(req.query.filter || '{}')
    if (emailId) {
      await OutgoingEmailLink.findAll({ where: { emailId: emailId } })
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
          logger.error(sendData.errorMessage, { meta: error })
          res.status(400).send({ message: 'Email not found' })
        })
    }
  },
}

async function sendEmail(newEmail) {
  const sendData = {
    errorMessage: '',
  }

  const emailAccount = await EmailAccount.findByPk(newEmail.fromId)

  if (emailAccount) {
    if (!emailAccount.password) {
      sendData.errorMessage = 'No email password'
      logger.error(sendData.errorMessage, { meta: error })
    }

    emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

    let emailConfig = {
      credentials: {
        host: emailAccount.smtpHost,
        port: emailAccount.smtpPort,
        secure: emailAccount.smtpTls,
        auth: {
          user: emailAccount.user,
          pass: emailAccount.password,
        },
        tls: {
          rejectUnauthorized: emailAccount.smtpTls,
        },
      },
    }

    let transporter = nodemailer.createTransport(emailConfig.credentials)

    transporter.verify(function (error, success) {
      if (error) {
        sendData.errorMessage = 'Error while connecting to email service'
        logger.error('Error while connecting to email service', { meta: error })
      } else {
        const attachments = JSON.parse(newEmail.attachments)

        let convertAttachments = []
        for (let attachment of attachments) {
          const buffer = Buffer.from(new Uint8Array(attachment.content))
          convertAttachments.push({
            content: buffer,
            filename: attachment.filename,
            contentType: attachment.contentType,
          })
        }

        let mailOptions = {
          from: emailAccount.name,
          to: newEmail.to,
          cc: newEmail.cc,
          bcc: newEmail.bcc,
          subject: newEmail.subject,
          html: newEmail.body,
          attachments: convertAttachments,
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            sendData.errorMessage = 'Error while sending email'
            logger.error(sendData.errorMessage, { meta: error })
          }

          await newEmail.update({ sended: true, date: new Date() })

          logger.verbose('Email sent', { meta: info })
        })
      }
    })
  } else {
    sendData.errorMessage = 'Email account no filled!'
    logger.error(sendData.errorMessage, { meta: error })
  }
}
