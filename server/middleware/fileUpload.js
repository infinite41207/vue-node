const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = getFolder(req)
    cb(null, folder)
  },

  filename: function (req, file, cb) {
    const fileName = getFileName(file)
    cb(null, fileName)
  },
})

function getFileName(file) {
  let fileName = file.originalname
  let fileExt = ''

  const re = /(?:\.([^.]+))?$/
  fileExt = re.exec(file.originalname)[0]
  fileName = String(file.originalname).replace(fileExt, '')

  const reg = /[^a-zA-Z0-9-_]/g
  fileName = String(fileName).replace(reg, '_')

  fileName = fileName.toLowerCase()

  return `${fileName}_${Date.now()}${fileExt}`
}

function getFolder(req) {
  const dateFolder = moment().format('DD_MM_YYYY')
  const fullFolder = `${process.env.DESTINATION}/common/${dateFolder}`

  if (!fs.existsSync(fullFolder)) {
    fs.mkdirSync(fullFolder, { recursive: true })
  }

  return fullFolder
}

module.exports = multer({
  storage: storage,
})
