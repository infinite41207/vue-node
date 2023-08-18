const path = require('path')
const fs = require('fs')
const readline = require('readline')
const events = require('events')

const directoryPath = path.join(__dirname, '../../../../access_log')

const processLineByLine = async (filePath) => {
  const linesArray = []
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    })

    rl.on('line', (line) => {
      linesArray.push(JSON.parse(line))
    })

    await events.once(rl, 'close')
  } catch (err) {
    console.error(err)
  }

  return linesArray
}

const getFileLines = async (req) => {
  const fileName = req.params.name
  const filePath = directoryPath + '/' + fileName
  const resArray = await processLineByLine(filePath)
  return resArray
}

module.exports = {
  async getAllFiles(req, res, next) {
    let allFiles = []

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        console.error(err)
        res.status(400).send({
          message: 'Bad request',
        })
      }
      files.forEach((file) => {
        allFiles.push(file)
      })

      res.status(200).send(allFiles)
    })
  },

  async getFileInfo(req, res) {
    const linesArray = await getFileLines(req)
    res.status(200).send(linesArray)
  },
}
