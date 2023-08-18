const ObjectModel = require('../models/index')
const ObjectModelPhoto = require('../models/photoWeighting')

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const uuidlib = require('uuid')
const moment = require('moment')
const objectDescription = 'Scale'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBwb3J0IiwiaWF0IjoxNjc0Mzg2NzYzfQ.VfFpHP8qPnj5V4_ps9diXzqSiMKmCNAVqhPAaW4bsF4'

module.exports = {
  async getWeightById(req, res, next) {
    let { dataValues } = await ObjectModel.findByPk(req.params.id)

    if (dataValues) {
      let { gatewayServer, gatewayPort, gatewayResource } = dataValues
      let protocol = 'http://'

      let urlOnScale = `${protocol}${gatewayServer}:${gatewayPort}${gatewayResource}` //- реальний вага 1

      let config = {
        method: 'get',
        url: urlOnScale,
        headers: { token: token },
      }

      try {
        let response = await axios(config)
        if (response.status) {
          res.status(200).send(response.data)
        }
      } catch (err) {
        res.status(400).send({ message: `${objectDescription}: ${err}` })
        console.error(err)
        throw err
      }
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async getPhototoScale(req, res, next) {
    let { dataValues } = await ObjectModel.findByPk(req.params.id)
    let protocol = 'http://'

    if (dataValues) {
      try {
        let { videoRecorderServer, videoRecorderPort, videoRecorderRequest, videoRecorderUser, videoRecorderPassword, name } = dataValues

        if ((videoRecorderServer, videoRecorderPort, videoRecorderRequest, videoRecorderUser, videoRecorderPassword)) {
          videoRecorderServer = videoRecorderServer.split(',')

          if (req.params.deliveryNote === 'test') {
            let responseVideoRecor = []
            for (let i = 0; i < videoRecorderServer.length; i++) {
              try {
                let photo = await getPhototo(protocol, videoRecorderUser, videoRecorderPassword, videoRecorderServer[i].trim(), videoRecorderPort, videoRecorderRequest)
                responseVideoRecor.push({
                  videoRecorderServer: videoRecorderServer[i].trim(),
                  status: photo.status,
                })
              } catch (e) {
                console.error(e)
              }
            }
            res.status(200).send(responseVideoRecor)
          } else {
            let responseVideoRecor = []
            for (let i = 0; i < videoRecorderServer.length; i++) {
              try {
                let photo = await getPhototo(protocol, videoRecorderUser, videoRecorderPassword, videoRecorderServer[i].trim(), videoRecorderPort, videoRecorderRequest)
                if (photo.status == 400) {
                  responseVideoRecor.push({
                    videoRecorderServer: videoRecorderServer[i].trim(),
                    status: photo.status,
                    msg: 'No access to the camera',
                    error: true,
                  })
                } else {
                  let infoFile = await savePhotoToFile(photo.data, name) // повертає шлях до файла
                  if (infoFile) {
                    responseVideoRecor.push({
                      videoRecorderServer: videoRecorderServer[i].trim(),
                      status: photo.status,
                      msg: 'Photo saved successfully to File',
                      error: false,
                    })
                    //save through model
                    let createPhotoDb = await createPhoto(infoFile, req.params.deliveryNote)
                    if (createPhotoDb) {
                      responseVideoRecor.push({
                        videoRecorderServer: videoRecorderServer[i].trim(),
                        status: photo.status,
                        msg: 'Photo saved successfully to DB',
                        error: false,
                      })
                    } else {
                      responseVideoRecor.push({
                        videoRecorderServer: videoRecorderServer[i].trim(),
                        status: photo.status,
                        msg: 'Photo is not saved  to DB',
                        error: true,
                      })
                    }
                  } else {
                    responseVideoRecor.push({
                      videoRecorderServer: videoRecorderServer[i].trim(),
                      status: photo.status,
                      msg: `${objectDescription} photo is not save to DB and in file`,
                      error: true,
                    })
                  }
                }
              } catch (err) {
                responseVideoRecor.push({
                  videoRecorderServer: videoRecorderServer[i].trim(),
                  status: photo.status,
                  msg: `${objectDescription} photo has Error: ${err}`,
                  error: true,
                })
              }
            }
            res.status(200).send({ status: responseVideoRecor })
          }
        } else {
          res.status(200).send([
            {
              videoRecorderServer: videoRecorderServer,
              status: false,
              msg: `${objectDescription} photo is not save error global`,
              error: true,
            },
          ])
        }
      } catch (e) {
        res.status(200).send([
          {
            videoRecorderServer: 'not found',
            status: false,
            msg: `Not found camers`,
            error: true,
          },
        ])
      }
    } else {
      console.error('can not find info: ', dataValues)
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },


  //get photo buffer

  async getPhotoBuffer(req, res, next) {

    const rootDirectoryPath = path.dirname(require.main.filename);
    const fullPath = `${rootDirectoryPath}/public/photoStatic`
    const files = fs.readdirSync(fullPath)
    const grouped = {};
    files.forEach(filename => {
      // Отримати дату з рядка
      const date = filename.match(/_(\d{12})\.jpeg/)[0];
      // Перевірити, чи вже є масив для цієї дати
      if (!grouped[date]) {
        // Якщо ні, створити новий масив
        grouped[date] = [];
      }
      // Додати рядок до масиву згрупованих рядків для цієї дати
      grouped[date].push(filename);
    });

    const arr = Object.values(grouped).map((value) => {
      return value;
    });
    console.log("grouped", arr)
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomElement = arr[randomIndex];
    const returnBuffer = []
    for (let i = 0; i < randomElement.length; i++) {
      const pathPhoto = fullPath + "/" + randomElement[i]
      returnBuffer.push(fs.readFileSync(pathPhoto));
    }
    res.status(200).send(returnBuffer)
  }



}

async function getPhototo(protocol, login, password, ip, port, url) {
  let urlSnapshot = `${protocol}${ip}:${port}${url}`

  let config = {
    method: 'get',
    url: urlSnapshot,
    auth: {
      username: login,
      password: password,
    },
    responseType: 'arraybuffer',
  }

  try {
    let { data, status } = await axios(config)
    return { status, data }
  } catch (err) {
    console.error('getPhototo on http: ', err)
    return { status: 400, data: err }
  }
}

async function savePhotoToFile(content, nameScale) {
  try {
    let namePhoto = `${Date.now()}_${nameScale}_.jpeg`
    let type = namePhoto.split('_.')[1]

    let pathDir = getFolder()
    let fullName = `${pathDir}/${namePhoto}`

    fs.writeFileSync(fullName, content)

    let size = await getFileSize(fullName)
    return { fullName, namePhoto, type, size }
  } catch (err) {
    console.error('savePhotoToFile: ', err)
    return false
  }
}

function getFileSize(name) {
  // function to return file size
  return new Promise((resolve, reject) =>
    fs.stat(name, (err, { size }) => {
      if (err) return reject(err)
      resolve(size)
    })
  )
}

async function createPhoto(path, deliveryNote) {
  const objectData = {
    uuid: uuidlib.v4(),
    path: path.fullName,
    filename: path.namePhoto,
    type: path.type,
    size: path.size,
    deliveryNoteId: deliveryNote,

    //include
  }
  await ObjectModelPhoto.create(objectData)
    .then(async (newItem) => {
      if (newItem) {
        return newItem
      } else {
        console.log(`Photo is not created in DB`)
        return false
      }
    })
    .catch((err) => {
      console.error('createPhoto to DB:', err)
      return false
    })
}

function getFolder() {
  const dateFolder = moment().format('DD_MM_YYYY')
  const fullFolder = `${process.env.DESTINATION}/${process.env.DIR_PHOTO}/${dateFolder}`

  try {
    if (!fs.existsSync(fullFolder)) {
      fs.mkdirSync(fullFolder, { recursive: true })
    }
    return fullFolder
  } catch (err) {
    console.error(err)
    return false
  }
}
