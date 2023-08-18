const ReclamationFile = require('../models/reclamationFile')
const fileService = require('@services/fileService')

module.exports = {
  async attachFiles(req, res) {
    const files = req.body.params.files
    
    if (files) {
      try {
        for (let file of files) {
          await ReclamationFile.create({
            reclamationId: req.body.params.id,
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            destination: file.destination,
            size: file.size,
            type: file.type,
            description: req.body.params.description,
            hasProtocol: req.body.params.verification_protocol,
          }).catch((err) => {
            throw err
          })
        }

        res.status(200).send({ message: 'OK' })
      } catch (err) {
        console.error(err)
        res.status(400).send({ message: err })
      }
    } else {
      res.status(400).send({ message: 'No files' })
    }
  },

  async getSubjectFiles(req, res) {
    const filter = JSON.parse(req.query.filter || '{}');

    await ReclamationFile.findAll({
      filter
    })
      .then((result) => {
        for (let file of result) {
          file.size = (file.size / 1000).toFixed(1)
        }

        res.status(200).send(result)
      })
      .catch((err) => {
        res.status(400).send(err)
      })
  },

  async getFile(req, res) {
    await ReclamationFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (err) => {
          if (err) {
            console.error(err)
          }
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(501)
      })
  },

  async removeFile(req, res) {
    const existFile = await ReclamationFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await ReclamationFile.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'File does not exist!' })
    }
  },
}
