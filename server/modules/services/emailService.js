const nodemailer = require('nodemailer')
const config = require('config')
const logger = require('@logging/logger')
const fs = require('fs')

const reclamationModel = require('@documents/reclamations/models/reclamation')
const reclamationTypeModel = require('@catalogs/reclamationTypes/models')
const reclamationExecutionTypeModel = require('@catalogs/reclamationExecutionTypes/models')
const reclamationDecisionModel = require('@catalogs/reclamationDecisions/models')
const reclamationStatusModel = require('@catalogs/reclamationStatuses/models')

const reclamationFilesModel = require('@documents/reclamations/models/reclamationFile')
const reclamationsEmailModel = require('@documents/reclamations/models/reclamationEmail')
const emailTemplatesModel = require('@catalogs/emailTemplates/models')

const moment = require('moment')
const commonService = require('@services/commonService')
const outgoingEmailController = require('@documents/outgoingEmails/controllers')
const OutgoingEmailLink = require('@documents/outgoingEmails/models/outgoingEmailLink')

// Set up the connection object
let emailConfig = {
  credentials: {
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODEMAILER_REJECT_UNAUTHORIZED,
    },
  },
}

module.exports = {
  async sendEmailNotification(emailData) {
    if (emailData.sourceType === 'task' && emailData.sourceData.ownerType === 'reclamation') {
      const reclamationsArray = await reclamationModel.findAll({
        where: {
          id: emailData.sourceData.ownerId,
        },
        include: [
          // { model: salesPointModel, as: 'salesPoint', attributes: ['id', 'name', 'email', 'full_name'] },
          { model: reclamationTypeModel, as: '_doc_type', attributes: ['id', 'description'] },
          { model: reclamationExecutionTypeModel, as: '_execution_type', attributes: ['id', 'description'] },
          { model: reclamationDecisionModel, as: '_decision', attributes: ['id', 'description'] },
          { model: reclamationStatusModel, as: '_status', attributes: ['id', 'description'] },
        ],
      })

      let currentReclamation
      if (reclamationsArray.length > 0) {
        currentReclamation = reclamationsArray[0].dataValues
      }

      if (currentReclamation) {
        let filterStr = {
          isActive: true,
          baseDocument: emailData.sourceType,
        }

        const emailTemplates = await emailTemplatesModel.findAll({
          where: filterStr,
        })

        const attachments = await this.getReclamationAttachments(emailData.sourceData.ownerId)

        for await (const item of emailTemplates) {
          const curTemplate = item.dataValues

          const conditionArgs = {
            emailData: emailData.sourceData,
            reclamation: currentReclamation,
          }

          const useTemplate = commonService.executeConditionCode(curTemplate.executionCondition, conditionArgs)
          if (useTemplate) {
            const recepientsList = commonService.executeConditionCode(curTemplate.recepientsCondition, conditionArgs)

            let languageVariantsList = []
            if (curTemplate.contentVariantsList) {
              languageVariantsList = JSON.parse(curTemplate.contentVariantsList).item
            }

            const clientLanguage = 'pl'
            const languageVariant = languageVariantsList.find((el) => el.language === clientLanguage)

            if (recepientsList && languageVariant) {
              if (recepientsList.length > 0) {
                let curContent = languageVariant.content

                const emailContent = {
                  date: emailData.sourceData.date,
                  fromId: 2,
                  to: recepientsList[0],
                  flags: [],
                  uuid: '',
                  subject: languageVariant.title,
                  body: curContent,
                  markedToDelete: false,
                  sended: false,
                  attachments: [],
                }

                const emailRes = await outgoingEmailController.createAtServer(emailContent)

                if (emailRes.email !== null) {
                  await OutgoingEmailLink.create({
                    emailUid: emailRes.email.emailUid,
                    emailId: emailRes.email.emailId,
                    documentId: emailData.sourceData.ownerId,
                    documentType: 'reclamation',
                    emailAccountId: 2,
                  }).catch((error) => {
                    console.error(error)
                  })
                }
              }
            }
          }
        }
      }
    }
  },

  async getReclamationAttachments(reclamationId) {
    const reclamationFiles = await reclamationFilesModel.findAll({
      where: { reclamationId: reclamationId },
    })
    const attachments = []

    if (reclamationFiles.length > 0) {
      reclamationFiles.forEach((el) => {
        attachments.push({
          filename: el.dataValues.originalname,
          content: fs.createReadStream(el.dataValues.path),
        })
      })
    }

    return attachments
  },

  async sendEmail(emailContent, attachments) {
    let mailOptions = {
      from: emailContent.from,
      to: emailContent.to,
      subject: emailContent.tittle,
      html: emailContent.emailText,
      attachments: attachments,
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return logger.error('Error while sending email', { meta: error })
      }
      logger.verbose('Email sent', { meta: info })
    })
  },

  replacesVaresInContent(reclamationVars, content) {
    let curContent = content
    reclamationVars.forEach((el) => {
      const regex = new RegExp(el.id, 'g')
      curContent = curContent.replace(regex, el.value)
    })
    return curContent
  },

  getReclamationVars(item) {
    let sales_point = ''
    let sales_point_fullname = ''

    // if (item._sales_point.dataValues) {
    //   sales_point = item._sales_point.dataValues.name;
    //   sales_point_fullname = item._sales_point.dataValues.full_name;
    // }

    let docType = ''
    if (item._doc_type.dataValues) {
      docType = item._doc_type.dataValues.description
    }
    let decision = ''
    if (item._decision.dataValues) {
      decision = item._decision.dataValues.description
    }

    let execution_type = ''
    // if (item._execution_type.dataValues) {
    //   execution_type = item._execution_type.dataValues.description;
    // }
    let status = ''
    if (item._status.dataValues) {
      status = item._status.dataValues.description
    }

    const varsArray = []
    varsArray.push({
      id: '#DECYZJA#',
      value: decision,
    })
    varsArray.push({
      id: '#DECYZJA_DATA#',
      value: item.decisionDate !== null ? moment(item.decisionDate).format('DD MM YYYY') : '',
    })

    varsArray.push({
      id: '#KLIENT#',
      value: sales_point,
    })
    varsArray.push({
      id: '#KLIENT_PELNA#',
      value: sales_point_fullname,
    })
    varsArray.push({
      id: '#KOMENTARZ#',
      value: item.comment,
    })
    varsArray.push({
      id: '#KOMENTARZ#KOMENTARZ_STATUS#',
      value: '',
    })
    varsArray.push({
      id: '#LW#',
      value: item.lw,
    })
    varsArray.push({
      id: '#NUMER#',
      value: item.number,
    })
    varsArray.push({
      id: '#POZYCJE#',
      value: '',
    })
    varsArray.push({
      id: '#REALIZACJA#',
      value: execution_type,
    })
    varsArray.push({
      id: '#STATUS#',
      value: status,
    })
    varsArray.push({
      id: '#TYP#',
      value: docType,
    })
    varsArray.push({
      id: '#UMOWA#',
      value: item.salesOrder,
    })
    varsArray.push({
      id: '#UZASADNIENIE#',
      value: '',
    })
    varsArray.push({
      id: '#ZLC#',
      value: item.zlc,
    })
    varsArray.push({
      id: '#ZLC_PR#',
      value: '',
    })
    varsArray.push({
      id: '#ZLC_WH_DATA#',
      value: moment(item.salesDate).format('DD MM YYYY'),
    })
    varsArray.push({
      id: '#ZLC_WH_OPIS#',
      value: '',
    })

    return varsArray
  },
}
