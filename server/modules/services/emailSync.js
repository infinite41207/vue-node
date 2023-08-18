const config = require('config')
const imapService = require('@services/imapService')
const simpleParser = require('mailparser').simpleParser
const cryptoGen = require('@common/auth/cryptoGen')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const IncomingEmails = require('@documents/incomingEmails/models')
const IncomingEmailsAttachment = require('@documents/incomingEmails/models/incomingEmailAttachment')
const Mailbox = require('@common/mailbox/models')
const fileService = require('@services/fileService')
const Counterparty = require('@catalogs/counterparties/models')
const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const CryptoJS = require('crypto-js')
const moment = require('moment')

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync emails...')

  await EmailAccount.findAll({ where: { isActive: true, forReceive: true, storeReceived: true } })
    .then(async (emailAccounts) => {
      for (let emailAccount of emailAccounts) {
        if (!emailAccount.password) {
          continue
        }

        console.log('Sync emails for', emailAccount.name)

        emailAccount.password = cryptoGen.decrypt(JSON.parse(emailAccount.password))

        const extMailboxes = await imapService.mailBox(emailAccount)

        if (extMailboxes) {
          const boxList = []
          convertToFlatList(extMailboxes, boxList, null)

          for (const mailbox of boxList) {
            mailbox.attribs = JSON.stringify(mailbox.attribs)

            let existMailbox = await Mailbox.findOne({ where: { emailAccountId: emailAccount.id, name: mailbox.name } }).catch((error) => {
              console.error('Error in incomingEmailSync', { meta: error })
              throw error
            })

            if (existMailbox) {
              await existMailbox.update({
                path: mailbox.path,
                attribs: mailbox.attribs,
                parent: mailbox.parent ? JSON.stringify({ name: mailbox.parent.name, path: mailbox.parent.path }) : mailbox.parent,
              })
            } else {
              await Mailbox.create({
                emailAccountId: emailAccount.id,
                name: mailbox.name,
                delimiter: mailbox.delimiter,
                attribs: mailbox.attribs,
                path: mailbox.path,
                parent: mailbox.parent ? JSON.stringify({ name: mailbox.parent.name, path: mailbox.parent.path }) : mailbox.parent,
                total: 0,
                new: 0,
                unseen: 0,
                nextUid: 1,
                flags: '[]',
                permFlags: '[]',
              })
            }
          }
        } else {
          continue
        }

        let mailboxes = await Mailbox.findAll({ where: { emailAccountId: emailAccount.id } }).catch((error) => {
          console.error('Error in incomingEmailSync', { meta: error })
          throw error
        })

        mailboxes = JSON.stringify(mailboxes)
        mailboxes = JSON.parse(mailboxes)

        for (const mailbox of mailboxes) {
          if (mailbox.name === 'Sent' || mailbox.name === 'Drafts') {
            continue
          }

          const emailsList = await imapService.syncMailbox(emailAccount, mailbox)

          if (emailsList.messages) {
            emailsList.parsedMessages = await parseEmailContent(emailsList.messages)

            for (let message of emailsList.parsedMessages) {
              const existEmail = await IncomingEmails.findAll({ where: { uid: message.uid, emailAccountId: emailAccount.id, mailboxId: mailbox.id } }).catch((error) => {
                console.error('Error in incomingEmailSync', { meta: error })
                throw error
              })

              const emailTo = JSON.stringify(message.to)

              const messageDate = message.date ? message.date : new Date()

              const counterpartyId = await getCounterparty(message.from)

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
                  hash: CryptoJS.MD5(`{from:${message.from.value},date:${messageDate}}`).toString(),
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
      }
    })
    .catch((error) => {
      console.error('Error in incomingEmailSync', { meta: error })
    })

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync emails')
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
          result.push(mailObject)
        })
        .catch(function (err) {
          console.error('Error in incomingEmailSync', { meta: err.message })
        })
    }
  }
  return result
}

function convertToFlatList(mailBoxes, boxList, parent) {
  for (let boxName in mailBoxes) {
    const boxLength = boxList.push({
      name: boxName,
      parent,
      path: parent ? `${parent.name}${parent.delimiter}${boxName}` : boxName,
      delimiter: mailBoxes[boxName].delimiter,
      attribs: mailBoxes[boxName].attribs,
    })

    if (mailBoxes[boxName].children) {
      convertToFlatList(mailBoxes[boxName].children, boxList, boxList[boxLength - 1])
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
