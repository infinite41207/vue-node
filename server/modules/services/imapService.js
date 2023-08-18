const Imap = require('imap'),
  inspect = require('util').inspect

module.exports = {
  async mailBox(emailAccount) {
    const imap = imapConnection(emailAccount)

    function getBoxes(cb) {
      imap.getBoxes(cb)
    }

    return new Promise((resolve, reject) => {
      imap.once('ready', function () {
        getBoxes(function (err, boxes) {
          if (err) reject(err)
          boxes = JSON.parse(JSON.stringify(boxes, getCircularReplacer()))
          resolve(boxes)
          imap.end()
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async emailList(emailAccount, boxPath, page, limit) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox(boxPath, true, cb)
    }

    return new Promise((resolve, reject) => {
      const EmailsList = {
        total: 0,
        new: 0,
        flags: [],
        unseen: 0,
        messages: [],
      }

      imap.once('ready', function () {
        openBox(function (err, box) {
          if (err) {
            return reject(err)
          }

          if (!box) {
            return reject(new Error('Box is not defined'))
          }

          EmailsList.total = box.messages.total
          EmailsList.new = box.messages.new
          EmailsList.flags = box.flags
          EmailsList.unseen = box.unseen

          if (box.messages.total === 0) {
            return resolve(EmailsList)
          }

          let idFrom = 1
          let idTo = box.messages.total
          if (box.messages.total > limit) {
            const diff = (page - 1) * limit + limit - 1
            idFrom = EmailsList.total - diff
            if (idFrom <= 0) {
              idFrom = 1
            }
            idTo = EmailsList.total - (page - 1) * limit
          }

          var f = imap.seq.fetch(`${idTo}:${idFrom}`, {
            bodies: ['HEADER.FIELDS (FROM TO CC SUBJECT DATE)'],
            struct: true,
          })

          f.on('message', function (msg, seqno) {
            let currentMessage = {
              seqno,
              uid: '',
              flags: [],
              buffer: '',
            }

            msg.on('attributes', function (attrs) {
              currentMessage.uid = attrs.uid
              currentMessage.flags = attrs.flags
            })

            msg.on('body', function (stream, info) {
              let buffer = ''

              stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8')
              })

              stream.once('end', function () {
                currentMessage.buffer = buffer
              })
            })

            msg.once('end', function () {
              EmailsList.messages.push(currentMessage)
            })
          })

          f.once('error', function (err) {
            console.error('Fetch error: ' + err)
            reject(err)
          })

          f.once('end', function () {
            imap.end()
            resolve(EmailsList)
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        imap.end()
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async emailDetailsBySeq(emailAccount, emailId) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox('INBOX', true, cb)
    }

    return new Promise((resolve, reject) => {
      let messages = []

      imap.once('ready', function () {
        openBox(function (err, box) {
          let f = imap.seq.fetch(`${emailId}:${emailId}`, {
            bodies: ['HEADER.FIELDS (FROM TO CC SUBJECT DATE)', ''],
            struct: true,
          })

          f.on('message', function (msg, seqno) {
            let currentMessage = {
              seqno,
              uid: '',
              flags: [],
              buffer: '',
            }

            msg.on('attributes', function (attrs) {
              currentMessage.uid = attrs.uid
              currentMessage.flags = attrs.flags
            })

            msg.on('body', function (stream, info) {
              let buffer = ''
              stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8')
              })
              stream.once('end', function () {
                currentMessage.buffer = buffer
              })
            })

            msg.once('end', function () {
              messages.push(currentMessage)
            })
          })
          f.once('error', function (err) {
            console.log('Fetch error: ' + err)
          })
          f.once('end', function () {
            imap.end()
            resolve(messages)
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        imap.end()
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async emailDetailsByUid(emailAccount, emailUid) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox('INBOX', true, cb)
    }

    return new Promise((resolve, reject) => {
      let messages = []

      imap.once('ready', function () {
        openBox(function (err, box) {
          imap.search([['UID', emailUid]], function (err, results) {
            let f = imap.fetch(results, {
              bodies: ['HEADER.FIELDS (FROM TO CC SUBJECT DATE)', ''],
              struct: true,
            })

            f.on('message', function (msg, seqno) {
              let currentMessage = {
                seqno,
                uid: '',
                flags: [],
                buffer: '',
              }

              msg.on('attributes', function (attrs) {
                currentMessage.uid = attrs.uid
                currentMessage.flags = attrs.flags
              })

              msg.on('body', function (stream, info) {
                let buffer = ''
                stream.on('data', function (chunk) {
                  buffer += chunk.toString('utf8')
                })
                stream.once('end', function () {
                  currentMessage.buffer = buffer
                })
              })

              msg.once('end', function () {
                messages.push(currentMessage)
              })
            })
            f.once('error', function (err) {
              console.log('Fetch error: ' + err)
            })
            f.once('end', function () {
              imap.end()
              resolve(messages)
            })
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async addEmailFlags(emailAccount, emailUid, flags) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox('INBOX', false, cb)
    }

    return new Promise((resolve, reject) => {
      imap.once('ready', function () {
        openBox(function (err, box) {
          if (err) reject(err)
          if (emailUid) {
            if (emailUid.length > 0) {
              imap.addFlags(emailUid, flags, (err) => {
                if (err) reject(err)
                imap.end()
                resolve(true)
              })
            }
          }
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async delEmailFlags(emailAccount, emailUid, flags) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox('INBOX', false, cb)
    }

    return new Promise((resolve, reject) => {
      imap.once('ready', function () {
        openBox(function (err, box) {
          if (err) reject(err)

          imap.delFlags(emailUid, flags, (err) => {
            if (err) {
              console.error(err)
              reject(err)
            }

            imap.end()
            resolve(true)
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async emailMove(emailAccount, emailUid, boxFrom, boxTo) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox(boxFrom.path, false, cb)
    }

    return new Promise((resolve, reject) => {
      imap.once('ready', function () {
        openBox(function (err, box) {
          if (err) reject(err)

          imap.move(emailUid, boxTo.path, (err) => {
            if (err) reject(err)
            imap.end()
            resolve(true)
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },

  async syncMailbox(emailAccount, mailbox) {
    const imap = imapConnection(emailAccount)

    function openBox(cb) {
      imap.openBox(mailbox.path, true, cb)
    }

    return new Promise((resolve, reject) => {
      const emailsList = {
        total: 0,
        new: 0,
        unseen: 0,
        flags: '[]',
        nextUid: 0,
        deleted: [],
        messages: [],
      }

      imap.once('ready', function () {
        openBox(function (err, box) {
          if (err) {
            reject(err)
          }

          emailsList.total = box.messages.total
          emailsList.new = box.messages.new
          emailsList.unseen = box.messages.unseen
          emailsList.flags = box.messages.flags
          emailsList.nextUid = box.uidnext

          // if (mailbox.nextUid === box.uidnext) {
          //   // no new emails
          //   imap.end()
          //   resolve(emailsList)
          // }

          imap.search([['UID', '1:*']], function (err, results) {
            if (results === undefined) {
              imap.end()
              return resolve(emailsList)
            }

            emailsList.deleted = getDeletedUids(results, mailbox.nextUid)
            let newUids = results.filter((el) => {
              return el >= mailbox.nextUid
            })

            if (newUids.length === 0) {
              imap.end()
              return resolve(emailsList)
            }

            if (newUids.length > 500) {
              newUids.sort((a, b) => {
                return a - b
              })

              newUids = newUids.slice(0, 500)
              emailsList.nextUid = newUids[newUids.length - 1] + 1
            }

            var f = imap.fetch(newUids, {
              bodies: ['HEADER.FIELDS (FROM TO CC SUBJECT DATE)', ''],
              struct: true,
            })

            f.on('message', function (msg, seqno) {
              let currentMessage = {
                seqno,
                uid: '',
                flags: [],
                buffer: '',
              }

              msg.on('attributes', function (attrs) {
                currentMessage.uid = attrs.uid
                currentMessage.flags = attrs.flags
              })

              msg.on('body', function (stream, info) {
                let buffer = ''
                stream.on('data', function (chunk) {
                  buffer += chunk.toString('utf8')
                })
                stream.once('end', function () {
                  currentMessage.buffer = buffer
                })
              })

              msg.once('end', function () {
                emailsList.messages.push(currentMessage)
              })
            })

            f.once('error', function (err) {
              console.error('Fetch error: ' + err)
              reject(err)
            })

            f.once('end', function () {
              imap.end()
              resolve(emailsList)
            })
          })
        })
      })

      imap.once('error', function (err) {
        console.error(err)
        imap.end()
        reject(err)
      })

      imap.once('end', function () {
        console.log('Connection ended')
      })
    })
  },
}

getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

function getDeletedUids(uids, maxUid) {
  let deleted = []

  for (i = 1; i < maxUid; i++) {
    if (!uids.includes(i)) {
      deleted.push(i)
    }
  }

  return deleted
}

function imapConnection(emailAccount) {
  const imap = new Imap({
    user: emailAccount.user,
    password: emailAccount.password,
    host: emailAccount.imapHost,
    port: emailAccount.imapPort,
    tls: emailAccount.imapTls,
  })

  imap.connect()

  return imap
}
