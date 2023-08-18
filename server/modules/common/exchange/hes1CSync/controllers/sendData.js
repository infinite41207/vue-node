const requestDataHandler = require('@services/requestDataHandler')
const exchangeObjectsontroller = require('@registers/exchangeObjects/controllers')
const axios = require('axios')
const moment = require('moment')

const authParams = {
  username: process.env.ONEC_USER,
  password: process.env.ONEC_PASSWORD,
}
const host1c = process.env.ONEC_HOST
const isSendTo1C = process.env.SEND_TO_1C

const ExchangeObject = require('@registers/exchangeObjects/models')
const dispositionStatusModel = require('@catalogs/dispositionStatuses/models')
const dispositionModel = require('@documents/dispositions/models')
const wagonInventoryObject = require('@documents/dispositions/models/wagonInventory')
const deliveryNoteModel = require('@documents/deliveryNotes/models')

module.exports = {
  async sendTo1c(req, res, next) {
    if (isSendTo1C === 'true') {
      await sendDispositions()
      await sendDeliveryNotes(req, res, next)
      await clearSendObjects(req, res, next)
    }
    // res.status(200).send(null);
  },
}

async function sendDispositions(req, res, next) {
  let dispositionsArray = []
  await ExchangeObject.findAll({ where: { sent: false, objectName: 'disposition' } }).then(async (result) => {
    for (let item of result) {
      const existItem = await dispositionModel.findByPk(item.dataValues.objectId, {
        include: {
          model: dispositionStatusModel,
          as: 'status',
          attributes: ['id', 'name', 'key', 'color'],
        },
      })
      dispositionsArray.push({
        id: existItem.id,
        number: existItem.number,
        date: moment(existItem.date).format('YYYYMMDDHHmmss'),
        state: existItem.status.key,
        correspondence: existItem.correspondence,
        numberOfWeighted: existItem.numberOfWeighted,
        exchangeId: item.id,
      })
    }
  })

  if (dispositionsArray.length > 0) {
    console.log('dispositionsArray.length = ', dispositionsArray.length)

    const data = requestDataHandler('POST', `${host1c}/write_dispositions`, authParams, { dispositions_array: dispositionsArray }, undefined, undefined)
    const response = await axios(data)
    try {
      if (response.status === 200) {
        const exchangeObject = []
        for (const item of response.data.objects_array) {
          exchangeObject.push(item.exchangeId)
        }
        await exchangeObjectsontroller.confirmExchange({ body: { objects: exchangeObject } }, res)
      }
    } catch (err) {}
  }
}

async function sendDeliveryNotes(req, res, next) {
  const currentDateTime = moment(Date.now()).format('YYYYMMDDHHmmss')
  let deliveryNotesArray = []
  await ExchangeObject.findAll({ where: { sent: false, objectName: 'deliveryNote' } }).then(async (result) => {
    for (let item of result) {
      const existItem = await deliveryNoteModel.findByPk(item.dataValues.objectId)
      deliveryNotesArray.push({
        id: existItem.id,
        number: existItem.numberStr,
        date: moment(existItem.date).format('YYYYMMDDHHmmss'),
        dispositionId: existItem.dispositionId,
        state: existItem.state,
        authorId: existItem.authorId,
        bruttoAuthorId: existItem.bruttoAuthorId,
        tareAuthorId: existItem.tareAuthorId,
        nettoAuthorId: existItem.nettoAuthorId,
        scaleBruttoId: existItem.scaleBruttoId,
        scaleTareId: existItem.scaleTareId,
        scaleNettoId: existItem.scaleNettoId,
        bruttoTime: moment(existItem.bruttoTime).format('YYYYMMDDHHmmss'),
        tareTime: moment(existItem.tareTime).format('YYYYMMDDHHmmss'),
        nettoTime: moment(existItem.nettoTime).format('YYYYMMDDHHmmss'),
        brutto: existItem.brutto,
        tare: existItem.tare,
        netto: existItem.netto,
        exchangeId: item.id,
      })
    }
  })

  if (deliveryNotesArray.length > 0) {
    console.log('deliveryNotesArray.length = ', deliveryNotesArray.length)
    const data = requestDataHandler('POST', `${host1c}/write_delivery_notes`, authParams, { delivery_notes_array: deliveryNotesArray }, undefined, undefined)
    const response = await axios(data)
    try {
      if (response.status === 200) {
        const exchangeObject = []
        for (const item of response.data.objects_array) {
          exchangeObject.push(item.exchangeId)
        }

        await exchangeObjectsontroller.confirmExchange({ body: { objects: exchangeObject } }, res)
      }
    } catch (err) {}
  }
}

async function clearSendObjects() {}
