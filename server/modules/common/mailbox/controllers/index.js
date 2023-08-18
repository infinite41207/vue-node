const httpStatus = require('http-status-codes')
const imapService = require('@services/imapService')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const IncomingEmailLink = require('@documents/incomingEmails/models/incomingEmailLink')
const incomingEmailController = require('@documents/incomingEmails/controllers')
const simpleParser = require('mailparser').simpleParser
const cryptoGen = require('@common/auth/cryptoGen')
const logger = require('@logging/logger')
const IncomingEmails = require('@documents/incomingEmails/models')
const fileService = require('@services/fileService')
const Counterparty = require('@catalogs/counterparties/models')
const CryptoJS = require('crypto-js')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

const Mailbox = require('@common/mailbox/models')

module.exports = {
  async getAll(req, res, next) {
    const { emailAccountId, page, limit } = req.query

    const box = JSON.parse(req.query.box)

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (emailAccount.storeReceived === true) {
          req.emailAccount = emailAccount
          return next()
        }

        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          const emailsList = await imapService.emailList(emailAccount, box.path, Number(page), Number(limit))

          if (emailsList.messages) {
            emailsList.messages.sort((a, b) => {
              return b.seqno - a.seqno
            })
            emailsList.messages = await parseEmailContent(emailsList.messages)
          }

          for (let message of emailsList.messages) {
            message.hasLinks = false
            message.links = []
            message.linkType = ''

            await IncomingEmailLink.findAll({ where: { emailUid: message.uid, emailAccountId: emailAccount.id } })
              .then((emailLinks) => {
                if (emailLinks && emailLinks.length > 0) {
                  message.links = emailLinks
                  message.hasLinks = true
                  if (message.links.length > 1) {
                    message.linkType = 'common'
                  } else {
                    message.linkType = message.links[0].documentType
                  }
                }
              })
              .catch((error) => {
                console.error(error)
              })
          }
          res.status(200).send(emailsList)
        } catch (error) {
          logger.error('Error while getting email list', { meta: error })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async getEmailDetailsBySeq(req, res, next) {
    const { emailAccountId } = req.query

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let emailDetails = await imapService.emailDetailsBySeq(emailAccount, req.params.id)
          emailDetails = await parseEmailContent(emailDetails)

          let message = emailDetails[0]

          if (message.html === false) {
            message.html = message.textAsHtml
          }

          return res.status(200).send(message)
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async getEmailDetailsByUid(req, res, next) {
    const { emailAccountId } = req.query

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (emailAccount.storeReceived === true) {
          req.emailAccount = emailAccount
          return next()
        }

        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let emailDetails = await imapService.emailDetailsByUid(emailAccount, req.params.id)
          emailDetails = await parseEmailContent(emailDetails)
          return res.status(200).send(emailDetails[0])
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async setEmailSeen(req, res, next) {
    const { emailAccountId, emailUid } = req.body

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let result = await imapService.addEmailFlags(emailAccount, emailUid, ['\\Seen'])

          if (result === true) {
            if (emailAccount.storeReceived === true) {
              incomingEmailController.setSeen(req, res)
            } else {
              return res.status(200).send(result)
            }
          } else {
            return res.status(400).send(result)
          }
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async setEmailUnseen(req, res, next) {
    const { emailAccountId, emailUid } = req.body

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let result = await imapService.delEmailFlags(emailAccount, emailUid, ['\\Seen'])

          if (result === true) {
            if (emailAccount.storeReceived === true) {
              incomingEmailController.setUnseen(req, res)
            } else {
              return res.status(200).send(result)
            }
          } else {
            return res.status(400).send(result)
          }
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async setEmailFlag(req, res, next) {
    const { emailAccountId, emailUid, flag } = req.body

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let result = await imapService.addEmailFlags(emailAccount, emailUid, [`\\${flag}`])

          if (result === true) {
            if (emailAccount.storeReceived === true) {
              incomingEmailController.setFlag(req, res)
            } else {
              return res.status(200).send(result)
            }
          } else {
            return res.status(400).send(result)
          }
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async moveEmail(req, res, next) {
    const { emailAccountId, emailUid, boxFrom, boxTo } = req.body

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          let result = await imapService.emailMove(emailAccount, emailUid, boxFrom, boxTo)

          if (result === true) {
            if (emailAccount.storeReceived === true) {
              const boxes = []
              boxes.push({ ...boxFrom })
              boxes.push({ ...boxTo })

              for (const box of boxes) {
                let mailbox = await Mailbox.findOne({ where: { emailAccountId: emailAccount.id, id: box.id } }).catch((error) => {
                  console.error('Error in incomingEmailSync', { meta: error })
                  throw error
                })

                const emailsList = await imapService.syncMailbox(emailAccount, mailbox)

                if (emailsList.messages) {
                  emailsList.parsedMessages = await parseEmailContent(emailsList.messages)

                  for (let message of emailsList.parsedMessages) {
                    const emailTo = JSON.stringify(message.to)
                    const counterpartyId = await getCounterparty(message.from)

                    const messageDate = message.date ? message.date : new Date()

                    const hash = CryptoJS.MD5(`{from:${message.from.value},date:${messageDate}}`).toString()

                    let prevEmail
                    if (mailbox.id === boxTo.id) {
                      prevEmail = await IncomingEmails.findOne({ where: { deleted: true, hash, emailAccountId: emailAccount.id, mailboxId: boxFrom.id } }).catch((error) => {
                        console.error('Error in incomingEmailSync', { meta: error })
                        throw error
                      })
                    }

                    if (prevEmail) {
                      await prevEmail.update({ deleted: false, mailboxId: mailbox.id, uid: message.uid }).catch((error) => {
                        console.error('Error in incomingEmailSync', { meta: error })
                        throw error
                      })
                    } else {
                      const existEmail = await IncomingEmails.findAll({ where: { uid: message.uid, emailAccountId: emailAccount.id, mailboxId: mailbox.id } }).catch((error) => {
                        console.error('Error in incomingEmailSync', { meta: error })
                        throw error
                      })

                      if (existEmail.length === 0) {
                        const newEmailData = {
                          uid: message.uid,
                          date: messageDate,
                          from: JSON.stringify(message.from),
                          to: emailTo === undefined ? JSON.stringify({ text: '-' }) : emailTo,
                          cc: message.cc ? JSON.stringify(message.cc) : null,
                          subject: message.subject,
                          html: message.html === false ? message.textAsHtml : message.html,
                          attachments: emailAccount.storeFilesToHardDrive === true ? '[]' : JSON.stringify(message.attachments),
                          attachmentsAtHardDrive: emailAccount.storeFilesToHardDrive === true,
                          flags: JSON.stringify(message.flags),
                          labels: '[]',
                          deleted: message.flags.includes('\\Deleted'),
                          hasLinks: false,
                          processed: false,
                          emailAccountId: emailAccount.id,
                          mailboxId: mailbox.id,
                          hash,
                          counterpartyId,
                        }

                        await IncomingEmails.create(newEmailData)
                          .then((newEmail) => {
                            if (newEmail && emailAccount.storeFilesToHardDrive === true) {
                              const fileFolder = fileService.getFolder()

                              for (let attachment of message.attachments) {
                                if (attachment.filename) {
                                  const fileName = fileService.getFileName(attachment.filename)
                                  const fullName = path.join(fileFolder, fileName)

                                  fs.writeFile(fullName, new Uint8Array(attachment.content), async (error) => {
                                    if (error) {
                                      console.error(error)
                                      throw error
                                    } else {
                                      const fileData = {
                                        emailAccountId: emailAccount.id,
                                        emailId: newEmail.id,
                                        emailUid: newEmail.uid,
                                        path: fullName,
                                        filename: fileName,
                                        originalname: attachment.filename,
                                        destination: fileFolder,
                                        type: attachment.contentType,
                                        size: attachment.size,
                                        checksum: attachment.checksum,
                                        contentDisposition: attachment.contentDisposition,
                                      }

                                      await IncomingEmailsAttachment.create(fileData).catch((error) => {
                                        console.error('Error in incomingEmailSync', { meta: error })
                                        throw error
                                      })
                                    }
                                  })
                                }
                              }
                            }
                          })
                          .catch((error) => {
                            console.error('Error in incomingEmailSync', { meta: error })
                            throw error
                          })
                      }
                    }
                  }

                  if (emailsList.nextUid > mailbox.nextUid) {
                    await Mailbox.update({ nextUid: emailsList.nextUid, new: emailsList.new, unseen: emailsList.unseen, flags: emailsList.flags }, { where: { id: mailbox.id } })
                  }
                }

                if (emailsList.deleted && emailsList.deleted.length > 0) {
                  await IncomingEmails.update({ deleted: true }, { where: { uid: { [Op.in]: emailsList.deleted }, mailboxId: mailbox.id } }).catch((error) => {
                    console.error('Error in incomingEmailSync', { meta: error })
                    throw error
                  })
                }
              }

              return res.status(200).send(true)
            } else {
              return res.status(200).send(result)
            }
          } else {
            return res.status(400).send(result)
          }
        } catch (err) {
          logger.error('Error while getting email details', { meta: err })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
        }
      } else {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not find' })
      }
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not set' })
    }
  },

  async getMailBoxInfo(req, res, next) {
    const { emailAccountId } = req.query

    if (emailAccountId) {
      const emailAccount = await EmailAccount.findByPk(emailAccountId)

      if (emailAccount) {
        if (emailAccount.storeReceived === true) {
          let mailboxes = await Mailbox.findAll({ where: { emailAccountId: emailAccount.id } }).catch((error) => {
            console.error('Error while getting mailbox info', { meta: error })
            res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: error })
          })

          if (mailboxes) {
            res.status(httpStatus.StatusCodes.OK).send(mailboxes)
          }
          return
        }

        if (!emailAccount.password) {
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account no correct' })
          return
        }

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        try {
          const mailBoxes = await imapService.mailBox(emailAccount)
          const boxList = []
          convertToFlatList(mailBoxes, boxList, null, 1)

          return res.status(200).send(boxList)
        } catch (err) {
          logger.error('Error while getting mailbox info', { meta: err })
          return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
        }
      }
    }
  },
}

const parseEmailContent = async (emailsList) => {
  const result = []
  for (let i = 0; i < emailsList.length; i++) {
    if (emailsList[i]) {
      await simpleParser(emailsList[i].buffer)
        .then(function (mailObject) {
          mailObject.seqno = emailsList[i].seqno
          mailObject.uid = emailsList[i].uid
          mailObject.flags = emailsList[i].flags

          mailObject.unseen = true
          if (mailObject.flags.length > 0) {
            if (mailObject.flags.includes('\\Seen')) {
              mailObject.unseen = false
            }
          }

          if (!mailObject.to) {
            mailObject.to = { html: '', text: '', value: {} }
          }
          result.push(mailObject)
        })
        .catch(function (err) {
          console.log('An error occurred:', err.message)
        })
    }
  }
  return result
}

function convertToFlatList(mailBoxes, boxList, parent, sort) {
  for (let boxName in mailBoxes) {
    const boxLength = boxList.push({
      sort: sort++,
      name: boxName,
      parent,
      path: parent ? `${parent.name}${parent.delimiter}${boxName}` : boxName,
      delimiter: mailBoxes[boxName].delimiter,
      attribs: mailBoxes[boxName].attribs,
      special_use_attrib: mailBoxes[boxName].special_use_attrib,
    })

    if (mailBoxes[boxName].children) {
      convertToFlatList(mailBoxes[boxName].children, boxList, boxList[boxLength - 1], sort)
    }
  }
}

async function getCounterparty(fromInfo) {
  if (fromInfo.value && fromInfo.value.length > 0) {
    const fromAddress = fromInfo.value[0].address

    if (fromAddress) {
      return await Counterparty.findOne({ where: { email: { [Op.iLike]: `%${fromAddress}%` } } }).then((existCounterparty) => {
        if (existCounterparty) {
          return existCounterparty.id
        } else {
          return null
        }
      })
    }
  }

  return null
}
