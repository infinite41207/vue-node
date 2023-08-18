const requestDataHandler = require('@services/requestDataHandler')
const axios = require('axios')
const uuidlib = require('uuid')
const { Op } = require('sequelize')

const authParams = {
  username: process.env.ONEC_USER,
  password: process.env.ONEC_PASSWORD,
}
const host1c = process.env.ONEC_HOST
const nodeNumber = process.env.ONEC_NODE
const getCatalogs = process.env.getCatalogs
const getDocumentDeliveryOrder = process.env.getDocumentDeliveryOrder
const getDocumentDisposition = process.env.getDocumentDisposition
const getDocumentDeliveryNote = process.env.getDocumentDeliveryNote
const getDocumentShipUnloading = process.env.getDocumentShipUnloading
const getRegisters = process.env.getRegisters
let messageNumber = 0
let isFull = false

const assortmentModel = require('@catalogs/assortments/models')
const boxModel = require('@catalogs/boxes/models')
const carrierModel = require('@catalogs/carriers/models')
const controlCompanyModel = require('@catalogs/controlCompanies/models')
const currencyModel = require('@catalogs/currencies/models')
const customerModel = require('@catalogs/counterparties/models')
const dispositionStatusModel = require('@catalogs/dispositionStatuses/models')
const driverModel = require('@catalogs/drivers/models')
const driverForwarderModel = require('@catalogs/drivers/models/driverForwarder')
const mineModel = require('@catalogs/mines/models')
const positionModel = require('@catalogs/positions/models')
const productModel = require('@catalogs/products/models')
const productForwarderModel = require('@catalogs/products/models/productForwarder')
const scaleModel = require('@catalogs/scales/models')
const schemeOfCargoModel = require('@catalogs/schemesOfCargo/models')
const shipModel = require('@catalogs/ships/models')
const trackModel = require('@catalogs/trackModels/models')
const vehicleModel = require('@catalogs/vehicles/models')
const weighingStationModel = require('@catalogs/weighingStations/models')
const vendorAndCustomerModel = require('@catalogs/vendorsAndCustomers/models')
const warehouseModel = require('@catalogs/warehouses/models')
const unitsOfMeasureModel = require('@catalogs/unitsOfMeasure/models')
const wharfModel = require('@catalogs/wharfs/models')
const userModel = require('@catalogs/users/models')
const workingPlaceModel = require('@catalogs/workingPlaces/models')
const deliveryOrderModel = require('@documents/deliveryOrders/models')
const dispositionModel = require('@documents/dispositions/models')
const wagonInventoryModel = require('@documents/dispositions/models/wagonInventory')
const deliveryNoteModel = require('@documents/deliveryNotes/models')
const shipUnloadingModel = require('@documents/shipsUnloading/models')
const plumbLineModel = require('@registers/plumbLines/models')
const inventoryModel = require('@registers/inventory/models')

module.exports = async (payload) => {
  if (payload) {
    isFull = payload
  }

  if (isFull === false) {
    await getMessageNumber()
    if (messageNumber === 0) return
  }

  const queryParams = `node_number=${nodeNumber}&message_number=${messageNumber}&is_full=${isFull}`

  console.log('\x1b[32m> START EXCHANGE \x1b[', new Date().toString())
  if (isFull === false || (getCatalogs && getCatalogs === 'true')) {
    await getCatalogAssortments(queryParams)
    await getCatalogWarehouses(queryParams)
    await getCatalogBoxes(queryParams)
    await getCatalogCarriers(queryParams)
    await getCatalogControlCompanies(queryParams)
    await getCatalogCustomers(queryParams)
    await getCatalogCurrencies(queryParams)
    await getCatalogVendorsAndCustomers(queryParams)
    await getCatalogDrivers(queryParams)
    // await getCatalogDriverForwarders(queryParams);
    await getCatalogMines(queryParams)
    await getCatalogPositions(queryParams)
    await getCatalogUnitsOfMeasure(queryParams)
    await getCatalogProducts(queryParams)
    // await getCatalogProductForwarders(queryParams);
    await getCatalogWeighingStations(queryParams)
    await getCatalogScales(queryParams)
    await getCatalogSchemesOfCargo(queryParams)
    await getCatalogShips(queryParams)
    await getCatalogTrackModels(queryParams)
    await getCatalogVehicles(queryParams)
    await getCatalogWharfs(queryParams)
    await getCatalogUsers(queryParams)
    await getCatalogWorkingPlaces(queryParams)
  }
  if (isFull === false || (getDocumentDeliveryOrder && getDocumentDeliveryOrder === 'true')) {
    await getDocumentsDeliveryOrders(queryParams)
  }
  if (isFull === false || (getDocumentDisposition && getDocumentDisposition === 'true')) {
    console.log('Get dispositions...')
    await getDocumentsDispositions(queryParams)
  }
  if (isFull === false || (getDocumentDeliveryNote && getDocumentDeliveryNote === 'true')) {
    await getDocumentsDeliveryNotes(queryParams)
  }
  if (isFull === false || (getDocumentShipUnloading && getDocumentShipUnloading === 'true')) {
    await getDocumentsShipsUnloading(queryParams)
  }
  if (isFull === false || (getRegisters && getRegisters === 'true')) {
    await getRegisterPlumbLines(queryParams)
    await getRegisterInventory(queryParams)
  }

  if (isFull === false) {
    await sendClearChanges()
  }

  console.log('\x1b[32m> FINISH EXCHANGE \x1b[', new Date().toString())
}

async function getMessageNumber() {
  const data = requestDataHandler('GET', `${host1c}/message_number?node_number=${nodeNumber}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        messageNumber = response.data.message_number
        console.log('\x1b[32m> Begin\x1b[0m Message number -->', messageNumber)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function sendClearChanges() {
  const data = requestDataHandler('GET', `${host1c}/clear_changes?node_number=${nodeNumber}&message_number=${messageNumber}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> 1C\x1b[0m Clear message -->')
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogAssortments(queryParams) {
  const objectDescription = 'Assortments'
  const data = requestDataHandler('GET', `${host1c}/assortments?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Assortments -->')
        for (let catalogItem of response.data.items) {
          const existItem = await assortmentModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await assortmentModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Assortments. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogWarehouses(queryParams) {
  const objectDescription = 'Warehouses'
  const data = requestDataHandler('GET', `${host1c}/warehouses?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Warehouses -->')
        for (let catalogItem of response.data.items) {
          const existItem = await warehouseModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            externalId: catalogItem.externalId,
            notes: catalogItem.notes,
            capacity: catalogItem.capacity,
            reflect: catalogItem.reflect,
            initDate: catalogItem.initDate,
            carsBuffer: catalogItem.carsBuffer,
            queueOn: catalogItem.queueOn,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await warehouseModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Warehouses. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogBoxes(queryParams) {
  const objectDescription = 'Boxes'
  const data = requestDataHandler('GET', `${host1c}/boxes?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Boxes -->')
        for (let catalogItem of response.data.items) {
          const existItem = await boxModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            externalId: catalogItem.externalId,
            registrAdress: catalogItem.registrAdress,
            warehouseId: catalogItem.warehouseId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await boxModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog boxes. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogCarriers(queryParams) {
  const objectDescription = 'Carriers'
  const data = requestDataHandler('GET', `${host1c}/carriers?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Carriers -->')
        for (let catalogItem of response.data.items) {
          const existItem = await carrierModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await carrierModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Carriers. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogControlCompanies(queryParams) {
  const objectDescription = 'Control companies'
  const data = requestDataHandler('GET', `${host1c}/control_companies?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Control companies -->')
        for (let catalogItem of response.data.items) {
          const existItem = await controlCompanyModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            comment: catalogItem.comment,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await controlCompanyModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Control companies. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogCustomers(queryParams) {
  const objectDescription = 'Counterparties'
  const data = requestDataHandler('GET', `${host1c}/customers?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Counterparties -->')
        for (let catalogItem of response.data.items) {
          const existItem = await customerModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            fullName: catalogItem.fullName,
            website: catalogItem.website,
            externalId: catalogItem.externalId,
            nip: catalogItem.nip,
            countryStr: catalogItem.countryStr,
            address: catalogItem.address,

            abbreviation: catalogItem.abbreviation,
            language: catalogItem.language,
            region: catalogItem.region,
            priceType: catalogItem.priceType,
            deliverySettings: catalogItem.deliverySettings,
            currencyStr: catalogItem.currencyStr,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await customerModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Counterparties. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogCurrencies(queryParams) {
  const objectDescription = 'Currencies'
  const data = requestDataHandler('GET', `${host1c}/currencies?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Currencies -->')
        for (let catalogItem of response.data.items) {
          const existItem = await currencyModel.findByPk(catalogItem.uuid)
          let objItem = {
            code: catalogItem.code,
            name: catalogItem.name,
            markedToDelete: catalogItem.markedToDelete,
            symbol: catalogItem.symbol,
            fullName: catalogItem.fullName,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await currencyModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Currencies. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogDrivers(queryParams) {
  const objectDescription = 'Drivers'
  const data = requestDataHandler('GET', `${host1c}/drivers?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Drivers -->')
        let testNumber = 0
        for (let catalogItem of response.data.items) {
          const existItem = await driverModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            idCard: catalogItem.idCard,
            termsOfUse: catalogItem.termsOfUse,
            phone: catalogItem.phone,
            driverForwarders: catalogItem.forwarders,
          }
          let newItem
          if (existItem) {
            await driverForwarderModel
              .destroy({
                where: { driverId: existItem.id },
              })
              .catch((error) => {
                console.error(error)
              })

            newItem = await existItem.update(objItem).catch((error) => {
              console.error(error)
            })
          } else {
            objItem.id = catalogItem.uuid
            newItem = await driverModel.create(objItem).catch((error) => {
              console.error(error)
            })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Drivers. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogDriverForwarders(queryParams) {
  const objectDescription = 'Driver forwarders'
  const data = requestDataHandler('GET', `${host1c}/driver_forwarders?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Driver forwarders -->')

        await driverForwarderModel.destroy({
          where: {},
          truncate: true,
        })

        for (let catalogItem of response.data.items) {
          let objItem = {
            id: uuidlib.v4(),
            driverId: catalogItem.driverId,
            forwarderId: catalogItem.forwarderId,
          }
          await driverForwarderModel.create(objItem)
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Driver forwarders. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogVendorsAndCustomers(queryParams) {
  const objectDescription = 'Vendors and customers'
  const data = requestDataHandler('GET', `${host1c}/vendors_and_customers?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Vendors and customers -->')
        for (let catalogItem of response.data.items) {
          const existItem = await vendorAndCustomerModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            isCustomer: catalogItem.isCustomer,
            isVendor: catalogItem.isVendor,
            isForwarder: catalogItem.isForwarder,
            notUse: catalogItem.notUse,
            numberOfCopies: catalogItem.numberOfCopies,
            fullName: catalogItem.fullName,
            useActualWarehouse: catalogItem.useActualWarehouse,
            sendDriversSms: catalogItem.sendDriversSms,
            useProductCondition: catalogItem.useProductCondition,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await vendorAndCustomerModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Vendors and customers. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogMines(queryParams) {
  const objectDescription = 'Mines'
  const data = requestDataHandler('GET', `${host1c}/mines?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Mines -->')
        for (let catalogItem of response.data.items) {
          const existItem = await mineModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await mineModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Mines. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogPositions(queryParams) {
  const objectDescription = 'Positions'
  const data = requestDataHandler('GET', `${host1c}/positions?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Positions -->')
        for (let catalogItem of response.data.items) {
          const existItem = await positionModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await positionModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Positions. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogUnitsOfMeasure(queryParams) {
  const objectDescription = 'Units of measure'
  const data = requestDataHandler('GET', `${host1c}/units_of_measure?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Units of measure -->')
        for (let catalogItem of response.data.items) {
          const existItem = await unitsOfMeasureModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await unitsOfMeasureModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Units of measure. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogProducts(queryParams) {
  const objectDescription = 'Products'
  const data = requestDataHandler('GET', `${host1c}/products?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Products -->')
        for (let catalogItem of response.data.items) {
          const existItem = await productModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            article: catalogItem.article,
            externalId: catalogItem.externalId,
            type: catalogItem.type,
            notUsedProductCondition: catalogItem.notUsedProductCondition,
            distinguishFont: catalogItem.distinguishFont,
            presentationColor: catalogItem.presentationColor,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})

            await productForwarderModel.destroy({
              where: { productId: catalogItem.uuid },
            })
          } else {
            objItem.id = catalogItem.uuid
            await productModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Products. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogProductForwarders(queryParams) {
  // const objectDescription = 'Product forwarders';
  const data = requestDataHandler('GET', `${host1c}/product_forwarders?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Product forwarders -->')

        await productForwarderModel.destroy({
          where: {},
          truncate: true,
        })

        for (let catalogItem of response.data.items) {
          let objItem = {
            id: uuidlib.v4(),
            productId: catalogItem.productId,
            forwarderId: catalogItem.forwarderId,
          }
          await productForwarderModel.create(objItem)
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Product forwarders. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogWeighingStations(queryParams) {
  const objectDescription = 'Weighing stations'
  const data = requestDataHandler('GET', `${host1c}/weighing_stations?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Weighing stations -->')
        for (let catalogItem of response.data.items) {
          const existItem = await weighingStationModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            typeOfDocument: catalogItem.typeOfDocument,
            scalesType: catalogItem.scalesType,
            barCodePrefix: catalogItem.barCodePrefix,
            automaticWeightingEnd: catalogItem.automaticWeightingEnd,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await weighingStationModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Weighing stations. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogScales(queryParams) {
  const objectDescription = 'Scales'
  const data = requestDataHandler('GET', `${host1c}/scales?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Scales -->')
        for (let catalogItem of response.data.items) {
          const existItem = await scaleModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            barCodePrefix: catalogItem.barCodePrefix,
            scalesNumber: catalogItem.scalesNumber,
            scalesVersion: catalogItem.scalesVersion,
            address: catalogItem.address,
            port: catalogItem.port,
            updatePeriod: catalogItem.updatePeriod,
            scalesType: catalogItem.scalesType,
            typeOfDocument: catalogItem.typeOfDocument,
            factor: catalogItem.factor,
            deviation: catalogItem.deviation,
            iot: catalogItem.iot,
            gatewayServer: catalogItem.gatewayServer,
            gatewayPort: catalogItem.gatewayPort,
            gatewayLogin: catalogItem.gatewayLogin,
            gatewayPassword: catalogItem.gatewayPassword,
            gatewayResource: catalogItem.gatewayResource,
            useVideoRecorder: catalogItem.useVideoRecorder,
            videoRecorderUser: catalogItem.videoRecorderUser,
            videoRecorderPassword: catalogItem.videoRecorderPassword,
            videoRecorderServer: catalogItem.videoRecorderServer,
            videoRecorderPort: catalogItem.videoRecorderPort,
            videoRecorderRequest: catalogItem.videoRecorderRequest,
            videoRecorderPathToFile: catalogItem.videoRecorderPathToFile,
            weighingStationId: catalogItem.weighingStationId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await scaleModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Scales. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogSchemesOfCargo(queryParams) {
  const objectDescription = 'Schemes of cargo'
  const data = requestDataHandler('GET', `${host1c}/schemes_of_cargo?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Schemes of cargo -->')
        for (let catalogItem of response.data.items) {
          const existItem = await schemeOfCargoModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            typeOfOperation: catalogItem.typeOfOperation,
            typeOfDocument: catalogItem.typeOfDocument,
            moving: catalogItem.moving,
            ship: catalogItem.ship,
            prefix: catalogItem.prefix,
            reverseOperation: catalogItem.reverseOperation,
            returnToWarehouse: catalogItem.returnToWarehouse,
            disableControlOnScales: catalogItem.disableControlOnScales,
            disableControlInDispositions: catalogItem.disableControlInDispositions,
            //defaultWarehouseId: catalogItem.defaultWarehouseId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await schemeOfCargoModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Schemes of cargo. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogShips(queryParams) {
  const objectDescription = 'Ships'
  const data = requestDataHandler('GET', `${host1c}/ships?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Ships -->')
        for (let catalogItem of response.data.items) {
          const existItem = await shipModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            comment: catalogItem.comment,
            imo: catalogItem.imo,
            length: catalogItem.length,
            number: catalogItem.number,
            width: catalogItem.width,
            externalId: catalogItem.externalId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await shipModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Ships. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogTrackModels(queryParams) {
  const objectDescription = 'Track models'
  const data = requestDataHandler('GET', `${host1c}/track_models?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Track models -->')
        for (let catalogItem of response.data.items) {
          const existItem = await trackModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await trackModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Track models. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogVehicles(queryParams) {
  const objectDescription = 'Vehicles'
  const data = requestDataHandler('GET', `${host1c}/vehicles?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Vehicles -->')
        for (let catalogItem of response.data.items) {
          const existItem = await vehicleModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            type: catalogItem.type,
            tare: catalogItem.tare,
            loadCapacity: catalogItem.loadCapacity,
            trackModelId: catalogItem.trackModelId,
            carrierId: catalogItem.carrierId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await vehicleModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Vehicles. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogWharfs(queryParams) {
  const objectDescription = 'Wharfs'
  const data = requestDataHandler('GET', `${host1c}/wharfs?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Wharfs -->')
        for (let catalogItem of response.data.items) {
          const existItem = await wharfModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await wharfModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Wharfs. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogUsers(queryParams) {
  const objectDescription = 'Users'
  const data = requestDataHandler('GET', `${host1c}/users?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Users -->')
        for (let catalogItem of response.data.items) {
          // console.log('catalogItem = ' + JSON.stringify(catalogItem, null, 2));
          // console.log('login = ', catalogItem.login);

          const existItem = await userModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            login: catalogItem.login,
            password: catalogItem.password,
            // markedToDelete: catalogItem.markedToDelete,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await userModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Users. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getCatalogWorkingPlaces(queryParams) {
  const objectDescription = 'Working places'
  const data = requestDataHandler('GET', `${host1c}/working_places?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import catalog Working places -->')
        for (let catalogItem of response.data.items) {
          // console.log('catalogItem = ' + JSON.stringify(catalogItem, null, 2));

          const existItem = await workingPlaceModel.findByPk(catalogItem.uuid)
          let objItem = {
            name: catalogItem.name,
            code: catalogItem.code,
            markedToDelete: catalogItem.markedToDelete,
            computerName: catalogItem.computerName,
            control: catalogItem.control,
            networkPort: catalogItem.networkPort,
            numberOfCopies: catalogItem.numberOfCopies,
            orientation: catalogItem.orientation,
            pageSize: catalogItem.pageSize,
            desibleWorkingInSeveralSessions: catalogItem.desibleWorkingInSeveralSessions,
            raisingRailwayDisposition: catalogItem.raisingRailwayDisposition,
            isRollPrinter: catalogItem.isRollPrinter,
            scaleId: catalogItem.scaleId,
            weighingStationId: catalogItem.weighingStationId,
            dispositionsSchemeOfCargoId: catalogItem.dispositionsSchemeOfCargoId,
          }
          if (existItem) {
            await existItem.update(objItem).then(async (updatedItem) => {})
          } else {
            objItem.id = catalogItem.uuid
            await workingPlaceModel.create(objItem).then(async (newItem) => {})
          }
        }
        console.log('\x1b[31m< End\x1b[0m import catalog Working places. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getDocumentsDeliveryOrders(queryParams) {
  const objectDescription = 'Delivery orders'
  const data = requestDataHandler('GET', `${host1c}/delivery_orders?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import documents Delivery orders -->')
        for (let documentItem of response.data.items) {
          // console.log("documentItem = " + JSON.stringify(documentItem, null, 2));

          const existItem = await deliveryOrderModel.findByPk(documentItem.uuid)
          let objItem = {
            number: documentItem.number,
            numberStr: documentItem.numberStr,
            date: documentItem.date,
            prefix: documentItem.prefix,
            markedToDelete: documentItem.markedToDelete,
            typeOfOperation: documentItem.typeOfOperation,
            endDate: documentItem.endDate,
            state: documentItem.status,
            comment: documentItem.comment,
            externalId: documentItem.externalID,
            quantity: documentItem.quantity,
            nonOracleLoad: documentItem.nonOracleLoad,
            dateClosing: documentItem.dateClosing,
            correspondence: documentItem.correspondence,
            gmp: documentItem.gmp,
            customsStatusOfGoods: documentItem.customsStatusOfGoods ? documentItem.customsStatusOfGoods : 'NonEU',
            customsNumber: documentItem.customsNumber,
            typeOfDocument: documentItem.typeOfDocument,
            dateIssueDSK: documentItem.dateIssueDSK ? documentItem.dateIssueDSK : null,
            maxDecrease: documentItem.maxDecrease ? documentItem.maxDecrease : 0,
            minutesCarService: documentItem.minutesCarService ? documentItem.minutesCarService : 0,
            useResearch: documentItem.useResearch,
            isOpenSubOrders: documentItem.isOpenSubOrders === null ? false : documentItem.isOpenSubOrders,
            timeStart: documentItem.timeStart,
            timeEnd: documentItem.timeEnd,
            arrivalsBlockingStart: documentItem.arrivalsBlockingStart ? documentItem.arrivalsBlockingStart : null,
            arrivalsBlockingEnd: documentItem.arrivalsBlockingEnd ? documentItem.arrivalsBlockingEnd : null,
            authorId: documentItem.authorId,
            counterpartyId: documentItem.ownerId,
            schemeOfCargoId: documentItem.schemeOfCargoId,
            warehouseId: documentItem.warehouseId,
            boxId: documentItem.boxId === '00000000-0000-0000-0000-000000000000' ? null : documentItem.boxId,
            forwarderId: documentItem.forwarderId,
            shipId: documentItem.shipId,
            productId: documentItem.productId,
            baseId: documentItem.baseId,
            controlCompanyId: documentItem.controlCompanyId,
            scaleId: documentItem.scaleId,
            weighingStationId: documentItem.weighingStationId,
            assortmentId: documentItem.assortmentId,
            authorId: documentItem.authorId,
          }

          if (existItem) {
            await existItem
              .update(objItem)
              .then(async (updatedItem) => {})
              .catch((err) => {
                console.log('Order not load: ' + objItem.numberStr)
                console.log(err)
              })
          } else {
            objItem.id = documentItem.uuid
            await deliveryOrderModel
              .create(objItem)
              .then(async (newItem) => {})
              .catch((err) => {
                console.log('Order not load: ' + objItem.numberStr)
                console.log(err)
              })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import documents Delivery orders. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getDocumentsDispositions(queryParams) {
  const objectDescription = 'Dispositions'
  const data = requestDataHandler('GET', `${host1c}/dispositions?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import documents Dispositions -->')
        for (let documentItem of response.data.items) {
          // console.log('documentItem = ' + JSON.stringify(documentItem, null, 2));

          const existItem = await dispositionModel.findByPk(documentItem.uuid)
          let objItem = {
            number: documentItem.number,
            numberStr: documentItem.numberStr,
            date: documentItem.date,
            prefix: documentItem.prefix,
            markedToDelete: documentItem.markedToDelete,
            comment: documentItem.comment,
            numberOfWeighings: documentItem.numberOfWeighings,
            numberOfWeighted: documentItem.numberOfWeighted,
            productCondition: documentItem.productCondition,
            quantity: documentItem.quantity,
            trainNumber: documentItem.trainNumber,
            type: documentItem.type,
            typeOfDocument: documentItem.typeOfDocument,
            typeOfOperation: documentItem.typeOfOperation,
            beginWeighting: documentItem.beginWeighting,
            endWeighting: documentItem.endWeighting,
            netto: documentItem.netto,
            closed: documentItem.closed,
            state: documentItem.state,
            ratified: documentItem.ratified,
            firstQuantity: documentItem.firstQuantity,
            advicesNumber: documentItem.advicesNumber,
            approvedDate: documentItem.approvedDate,
            deliveryNoteNumber: documentItem.deliveryNoteNumber,
            firstWeight: documentItem.firstWeight,
            arrivalDateDriver: documentItem.arrivalDateDriver,
            correspondence: documentItem.correspondence,
            driverPhoneNumber: documentItem.driverPhoneNumber,
            carsQueueStatus: documentItem.carsQueueStatus,
            useResearch: documentItem.useResearch,
            researchResult: documentItem.researchResult === '' ? null : documentItem.researchResult,
            createInSystemSkup: documentItem.createInSystemSkup,
            gmp: documentItem.gmp,
            gmpCheck: documentItem.gmpCheck,
            retarning: documentItem.retarning,
            allowRetaring: documentItem.allowRetaring,
            customsNumber: documentItem.customsNumber,
            dateIssueDSK: documentItem.dateIssueDSK,
            barCode: documentItem.barCode,
            driverTicket: documentItem.driverTicket,
            entryTicket: documentItem.entryTicket,
            authorId: documentItem.authorId,
            boxId: documentItem.boxId,
            carrierId: documentItem.carrierId,
            customerId: documentItem.customerId,
            driverId: documentItem.driverId,
            forwarderId: documentItem.forwarderId,
            productId: documentItem.itemId,
            orderId: documentItem.orderId,
            positionId: documentItem.positionId,
            scaleId: documentItem.scaleId,
            scaleTwoId: documentItem.scaleTwoId,
            schemeOfCargoId: documentItem.schemeOfCargoId,
            shipId: documentItem.shipId,
            vehicleId: documentItem.vehicleId,
            trailerId: documentItem.trailerId,
            vendorId: documentItem.vendorId,
            warehouseId: documentItem.warehouseId,
            actualWarehouseId: documentItem.actualWarehouseId,
            weighingStationId: documentItem.weighingStationId,
            mineId: documentItem.mineId,
            assortmentId: documentItem.assortmentId,
          }

          const dispositionStatus = await dispositionStatusModel.findOne({ where: { key: objItem.state } })
          if (dispositionStatus) {
            objItem.statusId = dispositionStatus.dataValues.id
          }

          // console.log("dispositionStatus - ", dispositionStatus);

          if (existItem) {
            await wagonInventoryModel.destroy({
              where: { dispositionId: existItem.id },
            })

            await existItem
              .update(objItem)
              .then(async (updatedItem) => {})
              .catch((err) => {
                console.log('Disposition not load: ' + objItem.numberStr + ' ' + objItem.date)
                console.log(err)
              })
          } else {
            objItem.id = documentItem.uuid
            await dispositionModel
              .create(objItem)
              .then(async (newItem) => {})
              .catch((err) => {
                console.log('Disposition not load: ' + objItem.numberStr + ' ' + objItem.date)
                console.log(err)
              })
          }

          if (documentItem.wagonInventory.length > 0) {
            for (let wagonInventoryRow of documentItem.wagonInventory) {
              let objItemRow = {
                id: wagonInventoryRow.uuid,
                date: wagonInventoryRow.date,
                lineNumber: wagonInventoryRow.lineNumber,
                plannedDateOfComposition: wagonInventoryRow.plannedDateOfComposition,
                transportStorageNumber: wagonInventoryRow.transportStorageNumber,
                orderNumber: wagonInventoryRow.orderNumber,
                dateAndTimeOfWagForQuay: wagonInventoryRow.dateAndTimeOfWagForQuay,
                basicWagQuantity: wagonInventoryRow.basicWagQuantity,
                quantityOfWagShift: wagonInventoryRow.quantityOfWagShift,
                quantityOfWagWhenRemainForWork: wagonInventoryRow.quantityOfWagWhenRemainForWork,
                timeOfComplete: wagonInventoryRow.timeOfComplete,
                hourBegunAdjust: wagonInventoryRow.hourBegunAdjust,
                quantityOfWagAdjust: wagonInventoryRow.quantityOfWagAdjust,
                hourLawAdjust: wagonInventoryRow.hourLawAdjust,
                quantityOfWagWhenRemainForReg: wagonInventoryRow.quantityOfWagWhenRemainForReg,
                hoursOfWagFromTerminal: wagonInventoryRow.hoursOfWagFromTerminal,
                comment: wagonInventoryRow.comment,
                workShifts: wagonInventoryRow.workShifts,
                totalCompositionTime: wagonInventoryRow.totalCompositionTime,
                dispositionId: wagonInventoryRow.dispositionId,
                wharfId: wagonInventoryRow.wharfId,
                forwarderId: wagonInventoryRow.forwarderId,
                carrierId: wagonInventoryRow.carrierId,
                schemeOfCargoId: wagonInventoryRow.schemeOfCargoId,
                productId: wagonInventoryRow.itemId,
                authorId: wagonInventoryRow.authorId,
              }

              await wagonInventoryModel.create(objItemRow).catch((err) => {
                console.log('wagonInventoryModel not load: ' + +objItem.numberStr)
                console.log(err)
              })
            }
          }
        }
        console.log('\x1b[31m< End\x1b[0m import documents Dispositions. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getDocumentsDeliveryNotes(queryParams) {
  const objectDescription = 'Delivery notes'
  const data = requestDataHandler('GET', `${host1c}/delivery_notes?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import documents Delivery notes -->')
        for (let documentItem of response.data.items) {
          // console.log('documentItem = ' + JSON.stringify(documentItem, null, 2));

          const existItem = await deliveryNoteModel.findByPk(documentItem.uuid)
          let objItem = {
            number: documentItem.number,
            numberStr: documentItem.numberStr,
            date: documentItem.date,
            prefix: documentItem.prefix,
            markedToDelete: documentItem.markedToDelete,
            brutto: documentItem.brutto,
            bruttoTime: documentItem.bruttoTime,
            comment: documentItem.comment,
            netto: documentItem.netto,
            nettoTime: documentItem.nettoTime,
            quantity: documentItem.quantity,
            state: documentItem.state,
            tare: documentItem.tare,
            tareTime: documentItem.tareTime,
            trainNumber: documentItem.trainNumber,
            typeOfDocument: documentItem.typeOfDocument,
            typeOfOperation: documentItem.typeOfOperation,
            cancelWeighting: documentItem.cancelWeighting,
            approved: documentItem.approved,
            approvedDate: documentItem.approvedDate,
            customsNumber: documentItem.customsNumber,
            dateIssueDSK: documentItem.dateIssueDSK,
            authorId: documentItem.authorId,
            warehouseId: documentItem.warehouseId,
            boxId: documentItem.boxId,
            bruttoAuthorId: documentItem.bruttoAuthorId,
            customerId: documentItem.customerId,
            dispositionId: documentItem.dispositionId,
            driverId: documentItem.driverId,
            forwarderId: documentItem.forwarderId,
            productId: documentItem.itemId,
            nettoAuthorId: documentItem.nettoAuthorId,
            positionId: documentItem.positionId,
            scaleBruttoId: documentItem.scaleBruttoId,
            scaleTareId: documentItem.scaleTareId,
            scaleNettoId: documentItem.scaleNettoId,
            schemeOfCargoId: documentItem.schemeOfCargoId,
            shipId: documentItem.shipId,
            tareAuthorId: documentItem.tareAuthorId,
            vehicleId: documentItem.vehicleId,
            trailerId: documentItem.trailerId,
            vendorId: documentItem.vendorId,
            approvedAuthorId: documentItem.approvedAuthorId,
            mineId: documentItem.mineId,
          }
          if (existItem) {
            await existItem
              .update(objItem)
              .then(async (updatedItem) => {})
              .catch((err) => {
                console.log('Delivery note not load: ' + objItem.numberStr)
              })
          } else {
            objItem.id = documentItem.uuid
            await deliveryNoteModel
              .create(objItem)
              .then(async (newItem) => {})
              .catch((err) => {
                // console.log("Delivery note not load: " + objItem.numberStr);
              })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import documents Delivery notes. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getDocumentsShipsUnloading(queryParams) {
  const objectDescription = 'Ships unloading'
  const data = requestDataHandler('GET', `${host1c}/ship_unloading?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import documents Ships unloading -->')
        for (let documentItem of response.data.items) {
          // console.log('documentItem = ' + JSON.stringify(documentItem, null, 2));

          const existItem = await shipUnloadingModel.findByPk(documentItem.uuid)
          let objItem = {
            number: documentItem.number,
            numberStr: documentItem.numberStr,
            date: documentItem.date,
            prefix: documentItem.prefix,
            markedToDelete: documentItem.markedToDelete,
            comment: documentItem.comment,
            netto: documentItem.netto,
            beginWeighting: documentItem.beginWeighting,
            endWeighting: documentItem.endWeighting,
            authorId: documentItem.authorId,
            boxId: documentItem.boxId,
            dispositionId: documentItem.dispositionId,
            positionId: documentItem.positionId,
            scaleId: documentItem.scaleId,
            warehouseId: documentItem.warehouseId,
          }
          if (existItem) {
            await existItem
              .update(objItem)
              .then(async (updatedItem) => {})
              .catch((err) => {
                console.log('Ship unloading not load: ' + objItem.numberStr)
                console.error(err)
              })
          } else {
            objItem.id = documentItem.uuid
            await shipUnloadingModel
              .create(objItem)
              .then(async (newItem) => {})
              .catch((err) => {
                console.log('Ship unloading not load: ' + objItem.numberStr + ' / ' + objItem.date)
                console.error(err)
              })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import documents Ships unloading. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getRegisterPlumbLines(queryParams) {
  const objectDescription = 'Plumb lines'
  const data = requestDataHandler('GET', `${host1c}/plumb_lines?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import data of register Plumb lines -->')

        // if (isFull === true) {
        //   await plumbLineModel.destroy({
        //     where: { date: { [Op.between]: [response.data.startDate, response.data.endDate] } },
        //   });
        // }

        for (let rowRegister of response.data.items) {
          // console.log('rowRegister = ' + JSON.stringify(rowRegister, null, 2));
          const filter = {
            date: rowRegister.date,
            shipUnloadingId: rowRegister.shipUnloadingId ? rowRegister.shipUnloadingId : null,
            dispositionId: rowRegister.dispositionId ? rowRegister.dispositionId : null,
            number: rowRegister.number ? rowRegister.number : null,
            beginWeighting: rowRegister.beginWeighting ? rowRegister.beginWeighting : null,
            endWeighting: rowRegister.endWeighting ? rowRegister.endWeighting : null,
          }

          const existItem = await plumbLineModel.findOne({ where: filter })

          let objItem = {
            date: rowRegister.date,
            number: rowRegister.number,
            beginWeighting: rowRegister.beginWeighting,
            endWeighting: rowRegister.endWeighting,
            count: rowRegister.count,
            enumerator: rowRegister.enumerator,
            shipUnloadingId: rowRegister.shipUnloadingId,
            dispositionId: rowRegister.dispositionId,
            scaleId: rowRegister.scaleId,
            boxId: rowRegister.boxId,
          }

          if (existItem) {
            await existItem
              .update(objItem)
              .then(async (updatedItem) => {})
              .catch((err) => {})
          } else {
            objItem.id = uuidlib.v4()
            await plumbLineModel
              .create(objItem)
              .then(async (newItem) => {
                // console.log("newItem id = ", newItem.id);
              })
              .catch((err) => {
                console.error(err)
              })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import data of register Plumb lines. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

async function getRegisterInventory(queryParams) {
  const objectDescription = 'Inventory'
  const data = requestDataHandler('GET', `${host1c}/inventory?${queryParams}`, authParams, {}, undefined, undefined)
  await axios(data)
    .then(async (response) => {
      if (response.status === 200) {
        console.log('\x1b[32m> Begin\x1b[0m import data of register Inventory -->')

        for (const rowRegistrator of response.data.items) {
          const filter = {
            registratorId: rowRegistrator.registratorId,
          }
          await inventoryModel.destroy({ where: filter })

          for (const rowRegister of rowRegistrator.rows) {
            let objItem = {
              id: uuidlib.v4(),
              registratorId: rowRegistrator.registratorId,
              registratorType: rowRegistrator.registratorType,
              date: rowRegister.date,
              typeOfOperation: rowRegister.typeOfOperation,
              count: rowRegister.count,
              productId: rowRegister.productId,
              ownerId: rowRegister.ownerId,
              warehouseId: rowRegister.warehouseId,
              boxId: rowRegister.boxId,
              forwarderId: rowRegister.forwarderId,
              orderId: rowRegister.orderId,
              expenseOrderId: rowRegister.expenseOrderId,
            }
            await inventoryModel
              .create(objItem)
              .then(async (newItem) => {})
              .catch((err) => {
                console.error(err)
              })
          }
        }
        console.log('\x1b[31m< End\x1b[0m import data of register Inventory. ', response.data.items.length)
      } else {
        console.error(err)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
