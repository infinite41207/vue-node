import axios from 'axios'
import { newUuid as getNewUuid } from '@/utils/commonUse.js'

export const getWeight = async (uuid, oldWeight) => {
  console.log('get weight form', uuid)
  if (!uuid) {
    return { weight: 0, stabilityIndex: 1 }
  }
  if (process.env.IS_ELECTRON) {
    //electron version
    const getOption = {
      method: 'get',
      url: `/scale/${uuid}`,
      headers: { 'Content-Type': 'application/json' },
    }
    //console.log(`/scale/${uuid}`)
    const { data } = await axios(getOption).catch(console.error)

    const typeConncect = ['Mechanical', 'IoT', 'TCP/IP', 'Modbus', 'COM', 'S7']
    let returnResalt = false
    if (data) {
      if (data.scaleProtocol) {
        switch (data.scaleProtocol.type) {
          case 'Mechanical':
            //console.log('Mechanical')
            break
          case 'IoT':
            returnResalt = await getWeightIoT(uuid, oldWeight)
            break
          case 'TCP/IP':
            returnResalt = await getWeightTcpIp(uuid, oldWeight, data.scaleProtocol)
            //console.log("returnResalt TCP/IP", returnResalt)
            break
          case 'Modbus':
            returnResalt = await getWeightModbus(uuid, oldWeight, data.scaleProtocol)
            //console.log("returnResalt Modbus", returnResalt)
            break
          case 'COM':
            //console.log('COM')
            returnResalt = { weight: 0, stabilityIndex: 1 }
            break
          case 'S7':
            returnResalt = await getWeightS7Protocol(uuid, oldWeight, data.scaleProtocol)
            break
          default:
            //console.log('default')
            returnResalt = { weight: 0, stabilityIndex: 1 }
          //console.log("Sorry,");
        }
      } else {
        returnResalt = { weight: 0, stabilityIndex: 1 }
      }
    }
    return returnResalt
  } else {
    return await getWeightIoT(uuid, oldWeight)
  }
}

export const thisIsShipment = (objDocument) => {
  const numberOfWeighings = objDocument.numberOfWeighings
  const reverseOperation = objDocument.schemeOfCargo.reverseOperation

  return (
    objDocument.typeOfOperation === 'Shipment' ||
    objDocument.typeOfOperation === 'DirectVariantShipment' ||
    objDocument.typeOfOperation === 'Reweighing' ||
    reverseOperation ||
    numberOfWeighings > 1
  )
}

export const getDataForWriteOK = async (view) => {
  let errorText = ''
  let isError = false
  let dispositionData = ''
  let deliveryNoteData = ''
  let newStateDisposition = ''
  let newStatusId = null
  let newAllowRetaring = view.currentDisposition.allowRetaring
  const authorId = view.currentUserId

  const currentDisposition = view.currentDisposition
  const currentDeliveryNote = view.currentDeliveryNote === '' ? null : view.currentDeliveryNote
  const currentWeight = Number(view.currentWeight)
  const weightType = view.weightType
  const operationWeight = view.operationWeight

  if (weightType === view.weightingTypes[0]) {
    newStateDisposition = 'FirstWeighing'
    if (currentDisposition.numberOfWeighings > 1) {
      if (currentDisposition.type === 'Loading') {
        newStateDisposition = 'Loaded'
      } else {
        newStateDisposition = 'Unloaded'
      }
      newAllowRetaring = false
    }
  } else {
    if (operationWeight === 'OK') {
      if (currentDisposition.numberOfWeighings > 1) {
        if (currentDisposition.numberOfWeighings === currentDisposition.numberOfWeighted) {
          newStateDisposition = 'Closed'
        } else {
          newStateDisposition = 'SecondWeighing'
        }
      } else {
        newStateDisposition = 'Closed'
      }
    } else if (operationWeight === 'ZeroDN') {
      newStateDisposition = 'ZeroDN'
    }
  }

  const params = {
    params: {
      filter: {
        key: newStateDisposition,
      },
    },
  }
  const response = await axios.get('/disposition_statuses', params)
  if (response) {
    newStatusId = response.data[0].id
  }

  dispositionData = {
    id: currentDisposition.id,
    state: newStateDisposition,
    statusId: newStatusId,
    allowRetaring: newAllowRetaring,
    correspondence: currentDisposition.correspondence,
  }

  let newStateDeliveryNote = ''
  let newBrutto = 0
  let newBruttoTime = null
  let newBruttoAuthorId = null
  let newBruttoScaleId = null
  let newTare = 0
  let newTareTime = null
  let newTareAuthorId = null
  let newTareScaleId = null
  let newNetto = 0
  let newNettoTime = null
  let newNettoAuthorId = null
  let newNettoScaleId = null

  if (weightType === view.weightingTypes[0]) {
    if (thisIsShipment(currentDisposition)) {
      newStateDeliveryNote = 'OnTare'
      newBrutto = 0
      newBruttoTime = null
      newBruttoAuthorId = null
      newBruttoScaleId = null
      newTare = currentWeight
      newTareTime = Date.now()
      newTareAuthorId = view.currentUserId
      newTareScaleId = view.currentScaleId
    } else {
      newStateDeliveryNote = 'OnBrutto'
      newBrutto = currentWeight
      newBruttoTime = Date.now()
      newBruttoAuthorId = view.currentUserId
      newBruttoScaleId = view.currentScaleId
      newTare = 0
      newTareTime = null
      newTareAuthorId = null
      newTareScaleId = null
    }
  } else {
    if (currentDeliveryNote === null && currentDisposition.numberOfWeighings > 1) {
      const queryParams = {
        dispositionId: currentDisposition.id,
      }
      const response = await view.$store.dispatch('deliveryNotes/getLastTareOfReversOperation', queryParams)
      if (response) {
        const lastTareWeitingParams = response.data
        if (lastTareWeitingParams.tare > 0) {
          newTare = lastTareWeitingParams.tare
          newTareTime = lastTareWeitingParams.tareTime
          newTareAuthorId = lastTareWeitingParams.tareAuthorId
          newTareScaleId = lastTareWeitingParams.tareScaleId
        }
      }
    }
    if (thisIsShipment(currentDisposition)) {
      newStateDeliveryNote = 'OnBrutto'
      newTare = Number(currentDeliveryNote === null ? newTare : currentDeliveryNote.tare)
      if (operationWeight === 'OK') {
        newBrutto = currentWeight
      } else if (operationWeight === 'ZeroDN') {
        newBrutto = newTare
      }
      newBruttoTime = Date.now()
      newBruttoAuthorId = view.currentUserId
      newBruttoScaleId = view.currentScaleId
      newTareTime = currentDeliveryNote === null ? (newTareTime === null ? newBruttoTime : newTareTime) : currentDeliveryNote.tareTime
      newTareAuthorId = currentDeliveryNote === null ? (newTareAuthorId === null ? newBruttoAuthorId : newTareAuthorId) : currentDeliveryNote.tareAuthorId
      newTareScaleId = currentDeliveryNote === null ? (newTareScaleId === null ? newBruttoScaleId : newTareScaleId) : currentDeliveryNote.tareScaleId
    } else {
      newStateDeliveryNote = 'OnTare'
      newBrutto = Number(currentDeliveryNote === null ? 0 : currentDeliveryNote.brutto)
      newBruttoTime = currentDeliveryNote === null ? null : currentDeliveryNote.bruttoTime
      newBruttoAuthorId = currentDeliveryNote === null ? null : currentDeliveryNote.bruttoAuthorId
      newBruttoScaleId = currentDeliveryNote === null ? null : currentDeliveryNote.bruttoScaleId
      if (operationWeight === 'OK') {
        newTare = currentWeight
      } else if (operationWeight === 'ZeroDN') {
        newTare = newBrutto
      }
      newTareTime = Date.now()
      newTareAuthorId = view.currentUserId
      newTareScaleId = view.currentScaleId
    }

    newNetto = (newBrutto - newTare).toFixed(2)
    newNettoTime = Date.now()
    newNettoAuthorId = view.currentUserId
    newNettoScaleId = view.currentScaleId

    if (operationWeight === 'OK') {
      if (newBrutto === newTare) {
        errorText = 'UWAGA!!! Wynik drugiego ważenia równy pierwszemu. Zapis wagi nie jest możliwy.'
        isError = true
      }

      if (isError === false) {
        const overWeightParameters = calculateOverWeight(currentDisposition)
        if (overWeightParameters.ControlOn) {
          const calculatedWeight = overWeightParameters.weightOrder - overWeightParameters.WeightDeliveryNotes - newNetto
          if (calculatedWeight < 0) {
            errorText = 'UWAGA! Przekroczony tonaż zlecenia!!'
            isError = true
          }
        }
      }
    }
  }

  if (isError === false) {
    if (currentDeliveryNote) {
      deliveryNoteData = {
        action: 'update',
        id: currentDeliveryNote.id,
        state: newStateDeliveryNote,
        bruttoTime: newBruttoTime,
        bruttoAuthorId: newBruttoAuthorId,
        scaleBruttoId: newBruttoScaleId,
        brutto: newBrutto,
        tareTime: newTareTime,
        tareAuthorId: newTareAuthorId,
        scaleTareId: newTareScaleId,
        tare: newTare,
        nettoTime: newNettoTime,
        nettoAuthorId: newNettoAuthorId,
        scaleNettoId: newNettoScaleId,
        netto: newNetto,
        // authorId: authorId,
      }
    } else {
      const newUuid = getNewUuid()
      deliveryNoteData = {
        action: 'create',
        id: newUuid,
        number: 0,
        numberStr: '',
        date: Date.now(),
        prefix: 'LP',
        markedToDelete: false,
        comment: 'Create in node JS',
        authorId: view.currentUserId,
        state: newStateDeliveryNote,
        bruttoTime: newBruttoTime,
        bruttoAuthorId: newBruttoAuthorId,
        scaleBruttoId: newBruttoScaleId,
        brutto: newBrutto,
        tareTime: newTareTime,
        tareAuthorId: newTareAuthorId,
        scaleTareId: newTareScaleId,
        tare: newTare,
        nettoTime: newNettoTime,
        nettoAuthorId: newNettoAuthorId,
        scaleNettoId: newNettoScaleId,
        netto: newNetto,
        typeOfDocument: currentDisposition.typeOfDocument,
        typeOfOperation: currentDisposition.typeOfOperation,
        cancelWeighting: false,
        approved: false,
        customsNumber: currentDisposition.customsNumber,
        dateIssueDSK: currentDisposition.dateIssueDSK,
        warehouseId: currentDisposition.warehouseId,
        boxId: currentDisposition.boxId,
        customerId: currentDisposition.customerId,
        dispositionId: currentDisposition.id,
        driverId: currentDisposition.driverId,
        forwarderId: currentDisposition.forwarderId,
        productId: currentDisposition.productId,
        schemeOfCargoId: currentDisposition.schemeOfCargoId,
        shipId: currentDisposition.shipId,
        vehicleId: currentDisposition.vehicleId,
        trailerId: currentDisposition.trailerId,
        vendorId: currentDisposition.vendorId,
        approvedAuthorId: view.currentUserId,
        mineId: currentDisposition.mineId,
      }
    }
  }

  return {
    isError: isError,
    errorText: errorText,
    dispositionData: isError === true ? {} : dispositionData,
    deliveryNoteData: isError === true ? {} : deliveryNoteData,
  }
}

export const getDataForWriteNumberOfWeighted = (view) => {
  const dispositionData = {
    id: view.currentDisposition.id,
    numberOfWeighted: view.numberOfWeighted,
  }

  return dispositionData
}

export const getDataForWriteAddRemove = async (view) => {
  const currentDisposition = view.currentDisposition
  let newStateDisposition = ''
  let newStatusId = null
  let correspondence = view.currentDisposition.correspondence

  if (view.operationWeight === 'Add') {
    newStateDisposition = 'AddWeight'
    correspondence = correspondence + (correspondence === '' ? '' : '\n') + 'Dosypka ' + view.correctionWeight + ' ton'
  } else if (view.operationWeight === 'Remove') {
    newStateDisposition = 'RemoveWeight'
    correspondence = correspondence + (correspondence === '' ? '' : '\n') + 'Odsypka ' + view.correctionWeight + ' ton'
  }

  const params = {
    params: {
      filter: {
        key: newStateDisposition,
      },
    },
  }
  const response = await axios.get('/disposition_statuses', params)
  if (response) {
    newStatusId = response.data[0].id
  }

  const dispositionData = {
    id: currentDisposition.id,
    state: newStateDisposition,
    statusId: newStatusId,
    correspondence: correspondence,
  }

  return dispositionData
}

export const getDataForWriteSendToTare = async (view) => {
  const currentDisposition = view.currentDisposition
  const newStateDisposition = 'NaTerminalu'
  let newStatusId = null

  const params = {
    params: {
      filter: {
        key: newStateDisposition,
      },
    },
  }
  const response = await axios.get('/disposition_statuses', params)
  if (response) {
    newStatusId = response.data[0].id
  }

  const dispositionData = {
    id: view.currentDisposition.id,
    state: newStateDisposition,
    statusId: newStatusId,
  }

  return dispositionData
}

export const fillDeliveryNoteByDisposition = async (disposition, deliveryNote, includeArray, excludeArray) => {
  for (const propName in disposition) {
    let isInclude = true
    if (includeArray.length > 0) {
      const findValue = includeArray.find((e) => e === propName)
      if (findValue) {
        isInclude = false
      }
    }
    let isExclude = false
    if (excludeArray.length > 0) {
      const findValue = excludeArray.find((e) => e === propName)
      if (findValue) {
        isExclude = true
      }
    }
    if (isInclude === false || isExclude === true) {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(deliveryNote, propName)) {
      deliveryNote[propName] = disposition[propName]
    }
  }
  // objForFilling.typeOfDocument = currentDisposition.typeOfDocument
  // objForFilling.typeOfOperation = currentDisposition.typeOfOperation
  // objForFilling.cancelWeighting = false
  // objForFilling.approved = false
  // objForFilling.customsNumber = currentDisposition.customsNumber
  // objForFilling.dateIssueDSK = currentDisposition.dateIssueDSK
  // objForFilling.warehouseId = currentDisposition.warehouseId
  // objForFilling.boxId = currentDisposition.boxId
  // objForFilling.customerId = currentDisposition.customerId
  // objForFilling.dispositionId = currentDisposition.id
  // objForFilling.driverId = currentDisposition.driverId
  // objForFilling.forwarderId = currentDisposition.forwarderId
  // objForFilling.productId = currentDisposition.productId
  // objForFilling.schemeOfCargoId = currentDisposition.schemeOfCargoId
  // objForFilling.shipId = currentDisposition.shipId
  // objForFilling.vehicleId = currentDisposition.vehicleId
  // objForFilling.trailerId = currentDisposition.trailerId
  // objForFilling.vendorId = currentDisposition.vendorId
  // objForFilling.approvedAuthorId = view.currentUserId
  // objForFilling.mineId = currentDisposition.mineId
}

export const getPhotoScale = async (uuid, uuidDeliveryNote) => {
  console.log('GET getPhotoScale')
  const config = {
    method: 'get',
    url: `/scaleGet/photo/${uuid}/${uuidDeliveryNote}`,
    headers: { 'Content-Type': 'application/json' },
  }
  try {
    const { data } = await axios(config).catch(console.error)
    return data
  } catch (err) {
    console.error(err)
    return false
  }
}

export const calculateOverWeight = async (disposition) => {
  const outputParameters = { controlOn: false, weightOrder: 0, weightDeliveryNotes: 0 }

  if (!disposition) {
    return outputParameters
  }

  const deliveryOrderResponse = await axios.get(`/delivery_order/${disposition.orderId}`, { params: { id: disposition.orderId } })
  if (!deliveryOrderResponse) {
    return outputParameters
  }
  const deliveryOrder = deliveryOrderResponse.data
  if (!deliveryOrder.typeOfOperation === 'Shipment') {
    return outputParameters
  }
  if (deliveryOrder.quantity === 0) {
    return outputParameters
  }
  const weightForControl = Number(deliveryOrder.quantity) - Number(deliveryOrder.maxDecrease)
  if (weightForControl <= 0) {
    return outputParameters
  }

  outputParameters.controlOn = true
  outputParameters.weightOrder = weightForControl

  const deliveryNoteResponse = await axios.get(`/delivery_note_by_order/`, { params: { filter: { orderId: deliveryOrder.id } } })
  if (!deliveryNoteResponse) {
    return outputParameters
  }

  let weightDeliveryNotes = 0
  for (const item of deliveryNoteResponse.data) {
    weightDeliveryNotes += Number(item.netto)
  }
  outputParameters.weightDeliveryNotes = weightDeliveryNotes

  return outputParameters
}

async function getWeightIoT(uuid, oldWeight) {
  let newWeight = 0
  let stabilityIndex = 0
  let connect = false

  const config = {
    method: 'get',
    url: `/scaleGet/getWeight/${uuid}`,
    headers: { 'Content-Type': 'application/json' },
  }
  try {
    const { data, status } = await axios(config)
    if (status === 200) {
      connect = true
    }
    // console.log(data.weight, new Date())
    if (data) {
      if (data.weight) {
        newWeight = Number(data.weight) / 1000
        if (isNaN(newWeight)) {
          newWeight = 0
        }
      }
      if (!newWeight === oldWeight) {
        stabilityIndex = 1
      }
    }
    return { weight: newWeight, stabilityIndex: stabilityIndex, connect: connect }

  }catch (e) {
    return { weight: 0, stabilityIndex: 1, connect: false }
  }
}

async function getWeightTcpIp(uuid, oldWeight, arg) {
  //console.log("TCP/IP");
  let newWeight = 0
  let stabilityIndex = 0
  let connect = false

  const getWeight = await window.ipcRenderer.invoke('getWeightFromModbusTcpIp', {
    server: arg.server,
    port: arg.port,
    command: arg.command,
    parserType: arg.parserType,
  })
  //console.log("getWeight ", getWeight);
  if (getWeight) {
    connect = getWeight.connect
    if (getWeight.weight) {
      newWeight = Number(getWeight.weight) / 1000
      if (isNaN(newWeight)) {
        newWeight = 0
      }
    }
    if (!newWeight === oldWeight) {
      stabilityIndex = 1
    }
  }
  return { weight: newWeight, stabilityIndex: stabilityIndex, connect: connect }
}

async function getWeightModbus(uuid, oldWeight, arg) {
  //console.log("Modbus");
  let newWeight = 0
  let stabilityIndex = 0
  let connect = false

  const getWeight = await window.ipcRenderer.invoke('getWeightFromModbus', {
    server: arg.server,
    port: arg.port,
    register: arg.register,
    parserType: arg.parserType,
  })
  //console.log("getWeight ", getWeight);
  if (getWeight) {
    connect = getWeight.connect
    if (getWeight.weight) {
      newWeight = Number(getWeight.weight) / 1000
      if (isNaN(newWeight)) {
        newWeight = 0
      }
    }
    if (!newWeight === oldWeight) {
      stabilityIndex = 1
    }
  }
  return { weight: newWeight, stabilityIndex: stabilityIndex, connect: connect }
}

async function getWeightS7Protocol(uuid, oldWeight, arg) {
  let newWeight = 0
  let stabilityIndex = 0
  let connect = false

  const id = arg.id

  const config = {
    method: 'get',
    url: `/scale_protocol/${id}`,
    headers: { 'Content-Type': 'application/json' },
  }

  const { data, status } = await axios(config).catch(console.error)
  if (data.configS7.length) {
    let plcWeight = {}
    for (const el of data.configS7) {
      //TODO узгодити за ключ для ваги
      if (el.key == 'Weight') {
        plcWeight = el
      }
    }
    if (Object.keys(plcWeight).length) {
      const getWeight = await window.ipcRenderer.invoke('getWeightFromSiemens', {
        server: plcWeight.server, //192.168.5.99
        // port: plcWeight.port, // 102 || 8010
        port: '102',
        rack: 0,
        slot: 2,
        variables: { [plcWeight.key]: plcWeight.register }, // {weightW10: DB8,DINT82} - відправим. ответ буде-{weightW10: 1234}
      })
      if (!getWeight.error) {
        connect = getWeight.connect
        if (getWeight[plcWeight.key]) {
          newWeight = Number(getWeight[plcWeight.key]) / 1000
          if (isNaN(newWeight)) {
            newWeight = 0
          }
        }
        if (!newWeight === oldWeight) {
          stabilityIndex = 1
        }
      }
    }
  }
  return { weight: newWeight, stabilityIndex: stabilityIndex, connect: connect }
}

export const readValueS7 = async (scaleId, key) => {
  if (!scaleId) {
    return undefined
  }
  const response = await axios.get(`/scale/${scaleId}`)
  if (response && response.data.scaleProtocolId) {
    const responseProtocol = await axios.get(`/scale_protocol/${response.data.scaleProtocolId}`)
    if (responseProtocol && responseProtocol.data.configS7 && responseProtocol.data.configS7.length > 0) {
      const configRows = responseProtocol.data.configS7
      const configRow = configRows.find((row) => row.key == key)
      if (!configRow) {
        return getEmptyValueS7(configRow)
      }
      if (configRow.active === false) {
        return getEmptyValueS7(configRow)
      }
      if (process.env.IS_ELECTRON) {
        const objResult = {}
        objResult[key] = configRow.register
        const result = await window.ipcRenderer.invoke('getWeightFromSiemens', {
          server: configRow.server,
          port: '102',
          rack: 0,
          slot: 2,
          variables: objResult,
        })
        return result
      } else {
        return getEmptyValueS7(configRow)
      }
    }
  }
}

export const writeValueS7 = async (scaleId, key, value) => {
  if (!scaleId) {
    return { write: false, connect: false, error: 'Scale not found' }
  }
  const response = await axios.get(`/scale/${scaleId}`)
  if (response && response.data.scaleProtocolId) {
    const responseProtocol = await axios.get(`/scale_protocol/${response.data.scaleProtocolId}`)
    if (responseProtocol && responseProtocol.data.configS7 && responseProtocol.data.configS7.length > 0) {
      const configRows = responseProtocol.data.configS7
      const configRow = configRows.find((row) => row.key == key)
      if (!configRow) {
        console.log('!configRow')
        return { write: false, connect: true, error: 'Config row not found' }
      }
      if (!configRow.active || configRow.active === false) {
        console.log('configRow.active === false')
        return { write: false, connect: true, error: '' }
      }
      if (process.env.IS_ELECTRON) {
        console.log('IS_ELECTRON')
        const objResult = {}
        objResult[key] = configRow.register
        const result = await window.ipcRenderer.invoke('writeToSiemens', {
          server: configRow.server,
          port: '102',
          rack: 0,
          slot: 2,
          variables: objResult,
          value: value,
        })
        return result
      } else {
        return { write: false, connect: true, error: '' }
      }
    }
  }
}

function getEmptyValueS7(configRow) {
  if (configRow && configRow.valueType === 'real') {
    return 0
  } else if (configRow && configRow.valueType === 'bool') {
    return false
  } else {
    return undefined
  }
}
