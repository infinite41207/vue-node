const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Zaświadczenie zbiorcze z wagi kolejowej'
    const periodType = 0
    const showYTotal = true
    const showXTotal = true

    const columns = [
      {
        id: 0,
        sequence: 0,
        property: 'lineNumber',
        description: 'Nr',
        title: 'L. p.',
        valueType: 'number',
        textAlign: 'leftAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 1,
        sequence: 1,
        property: 'numberDeliveryNote',
        description: 'Numer kwitu',
        title: 'Nr kwitu',
        sqlColumnName: 'delivery_notes.number',
        valueType: 'text',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 3,
      },
      {
        id: 2,
        sequence: 2,
        property: 'vehicle',
        description: 'Samohód',
        title: 'Nr samohodu',
        sqlColumnName: 'delivery_notes."vehicleId"',
        valueType: 'object',
        action: 'getAllAutomobiles',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 3,
        sequence: 3,
        property: 'vehicle',
        description: 'Naczepa',
        title: 'Naczepa',
        sqlColumnName: 'vehicles.name',
        valueType: 'object',
        action: 'getAllTrailers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 4,
        sequence: 4,
        property: 'deliveryOrder',
        description: 'Zlecenie',
        title: 'Nr zlecenia',
        sqlColumnName: 'disposition."orderId"',
        valueType: 'object',
        action: 'getAllDeliveryOrders',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 5,
        sequence: 5,
        property: 'forwarder',
        description: 'Spedytor',
        title: 'Spedytor',
        sqlColumnName: 'delivery_notes."forwarderId"',
        valueType: 'object',
        action: 'getAllForwarders',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 6,
        sequence: 6,
        property: 'customer',
        description: 'Odbiorca',
        title: 'Odbiorca',
        sqlColumnName: 'delivery_notes."customerId"',
        valueType: 'object',
        action: 'getAllCustomers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 7,
        sequence: 7,
        property: 'vendor',
        description: 'Dostawca',
        title: 'Dostawca',
        sqlColumnName: 'delivery_notes."vendorId"',
        valueType: 'object',
        action: 'getAllVendors',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 8,
        sequence: 8,
        property: 'warehouse',
        description: 'Magazyn',
        title: 'Magazyn',
        sqlColumnName: 'delivery_notes."warehouseId"',
        valueType: 'object',
        action: 'getAllWarehouses',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 9,
        sequence: 9,
        property: 'typeOfOperation',
        description: 'Typ operacji',
        title: 'Typ operacji',
        sqlColumnName: 'delivery_notes."typeOfOperation"',
        valueType: 'text',
        textAlign: 'centerAlign',
        // action: 'getAllTypeOfOperation',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 7,
      },
      {
        id: 10,
        sequence: 10,
        property: 'scaleNetto',
        description: 'Waga',
        title: 'Waga',
        sqlColumnName: 'delivery_notes."scaleNettoId"',
        valueType: 'object',
        action: 'getAllScales',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 11,
        sequence: 11,
        property: 'bruttoTime',
        description: 'Data i czas ważenia brutto',
        title: 'Data i czas ważenia brutto',
        sqlColumnName: 'delivery_notes."bruttoTime"',
        valueType: 'date',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 12,
        sequence: 12,
        property: 'bruttoAuthor',
        description: 'Brutto wykonal wagowy',
        title: 'Brutto wykonal wagowy',
        sqlColumnName: 'delivery_notes."bruttoAuthorId"',
        valueType: 'object',
        action: 'getAllUsers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 13,
        sequence: 13,
        property: 'brutto',
        description: 'Brutto',
        title: 'Brutto',
        sqlColumnName: 'delivery_notes.brutto',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 8,
      },
      {
        id: 14,
        sequence: 14,
        property: 'tareTime',
        description: 'Data i czas ważenia tary',
        title: 'Data i czas ważenia tary',
        sqlColumnName: 'delivery_notes."tareTime"',
        valueType: 'date',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 15,
        sequence: 15,
        property: 'tareAuthor',
        description: 'Tarę wykonal wagowy',
        title: 'Tarę wykonal wagowy',
        sqlColumnName: 'delivery_notes."tareAuthorId"',
        valueType: 'object',
        action: 'getAllUsers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 16,
        sequence: 16,
        property: 'tare',
        description: 'Tara',
        title: 'Tara',
        sqlColumnName: 'delivery_notes.tare',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 8,
      },
      {
        id: 17,
        sequence: 17,
        property: 'netto',
        description: 'Netto',
        title: 'Netto',
        sqlColumnName: 'delivery_notes.netto',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 8,
      },
      {
        id: 18,
        sequence: 17,
        property: 'comment',
        description: 'Uwagi',
        title: 'Uwagi',
        sqlColumnName: 'delivery_notes.comment',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 8,
      },
    ]

    //SUM, MIN, MAX, COUNT
    const summColumns = [
      { name: 'rowsCount', operator: 'SUM' },
      { name: 'brutto', operator: 'SUM' },
      { name: 'tare', operator: 'SUM' },
      { name: 'netto', operator: 'SUM' },
    ]

    const addClasses = {}

    const returnParameters = {
      reportName,
      periodType,
      showYTotal,
      showXTotal,
      columns,
      summColumns,
      addClasses,
    }

    res.status(200).send(returnParameters)
  },

  async getDataReport(req, res, next) {
    let inputParameters = { ...req.body }

    transformInputFilter(inputParameters)

    const resData = await getQueryRecordsDetail(inputParameters.sqlFilters, inputParameters.sqlReplacements)
    const resultData = await transformResponseData(resData)

    let resposeDataSet = {
      resultData,
      periodPresentation: inputParameters.periodPresentation,
      filterPresentation: inputParameters.filterPresentation,
    }

    if (resposeDataSet) {
      res.status(200).send(resposeDataSet)
    } else {
      console.log(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },
}

async function getQueryRecordsDetail(filters, replacements) {
  let queryText =
    '\
          SELECT \
              delivery_notes.id, \
              delivery_notes.number AS number, \
              delivery_notes."vehicleId" as vehicle_id, \
              vehicles.name as vehicle_name, \
              delivery_notes."trailerId" as trailer_id, \
              trailers.name as trailer_name, \
              transport_orders.id as order_id, \
              transport_orders.number as order_name, \
              delivery_notes."forwarderId" as forwarder_id, \
              forwarders.name as forwarder_name, \
              delivery_notes."customerId" as customer_id, \
              counterparties.name as customer_name, \
              delivery_notes."vendorId" as vendor_id, \
              vendors.name as vendor_name, \
              delivery_notes."warehouseId" as warehouse_id, \
              warehouses.name as warehouse_name, \
              delivery_notes."typeOfOperation" as type_of_operation, \
              delivery_notes."scaleNettoId" as scale_netto_id, \
              scales_netto.name as scale_netto_name, \
              delivery_notes."bruttoTime" as brutto_time, \
              delivery_notes."bruttoAuthorId" as brutto_author_id, \
              brutto_authors.name as brutto_author_name, \
              delivery_notes.brutto as brutto, \
              delivery_notes."tareTime" as tare_time, \
              delivery_notes."tareAuthorId" as tare_author_id, \
              tare_authors.name as tare_author_name, \
              delivery_notes.tare as tare, \
              delivery_notes.netto as netto, \
              delivery_notes.comment AS comment \
          FROM \
              delivery_notes as delivery_notes \
              left join dispositions as dispositions \
              ON delivery_notes."dispositionId" = dispositions.id \
              left join transport_orders as transport_orders \
              ON dispositions."orderId" = transport_orders.id \
              left join vehicles as vehicles \
              ON delivery_notes."vehicleId" = vehicles.id \
              left join vehicles as trailers \
              ON delivery_notes."trailerId" = trailers.id \
              left join vendor_and_customers as forwarders \
              ON delivery_notes."forwarderId" = forwarders.id \
              left join vendor_and_customers as counterparties \
              ON delivery_notes."customerId" = counterparties.id \
              left join vendor_and_customers as vendors \
              ON delivery_notes."vendorId" = vendors.id \
              left join warehouses as warehouses \
              ON delivery_notes."warehouseId" = warehouses.id \
              left join scales as scales_netto \
              ON delivery_notes."scaleNettoId" = scales_netto.id \
              left join users as brutto_authors \
              ON delivery_notes."bruttoAuthorId" = brutto_authors.id \
              left join users as tare_authors \
              ON delivery_notes."tareAuthorId" = tare_authors.id \
          WHERE'

  for (let filter of filters) {
    queryText =
      queryText +
      ' \
                ' +
      filter
  }

  const response = await sequelize.query(queryText, { type: QueryTypes.SELECT, replacements })

  return response
}

function transformInputFilter(inputParameters) {
  inputParameters.sqlFilters = []
  inputParameters.sqlReplacements = {}

  let startDate
  let finishDate
  let periodPresentation

  if (inputParameters.periodType === 0) {
    startDate = new Date(inputParameters.reportDate).setHours(0, 0, 0, 0)
    finishDate = new Date(inputParameters.reportDate).setHours(23, 59, 59, 999)
    periodPresentation = 'na dzień: ' + formatDate(startDate)
  } else {
    startDate = new Date(inputParameters.periodStart).setHours(0, 0, 0, 0)
    finishDate = new Date(inputParameters.periodFinish).setHours(23, 59, 59, 999)
    periodPresentation = 'za okres: od ' + formatDate(startDate) + ' do ' + formatDate(finishDate)
  }

  let filterPresentation = ''
  let rowFilter = ''

  const filters = inputParameters.filters

  for (let filter of filters) {
    if (filter.use === true && filter.value) {
      let columnName = filter.sqlColumnName
      let valuePresentation = filter.value

      if (filter.valueType === 'object') {
        if (filter.operator === '=') {
          rowFilter = columnName + filter.operator + filter.value.id
          valuePresentation = filter.value.presentation
        } else if (filter.operator === 'inList') {
          let arrayIds = []
          let arrayNames = []

          for (let rowValue of filter.value) {
            arrayIds.push(rowValue.id)
            arrayNames.push(rowValue.presentation)
          }

          rowFilter = columnName + ' = ANY (ARRAY[' + arrayIds.toString() + '])'
          valuePresentation = '[' + arrayNames.toString() + ']'
        }
      } else if (filter.valueType === 'enum') {
        if (filter.operator === '=') {
          rowFilter = columnName + filter.operator + filter.value.id
          valuePresentation = filter.value.presentation
        } else if (filter.operator === 'inList') {
          let arrayIds = []
          for (let rowValue of filter.value) {
            arrayIds.push(rowValue)
          }
          rowFilter = columnName + ' = ANY (ARRAY[' + arrayIds.toString() + '])'
          valuePresentation = '[' + arrayNames.toString() + ']'
        }
      } else if (filter.valueType === 'text') {
        rowFilter = columnName + filter.operator + "'" + filter.value + "'"
      } else {
        rowFilter = columnName + filter.operator + filter.value
      }
      inputParameters.sqlFilters.push((inputParameters.sqlFilters.length === 0 ? '' : ' AND ') + rowFilter)

      filterPresentation += filterPresentation === '' ? '' : '; '
      filterPresentation += filter.description + ' ' + filter.operator + ' ' + valuePresentation
    }
  }

  rowFilter = 'delivery_notes.date BETWEEN :startDate AND :finishDate'
  inputParameters.sqlFilters.push((inputParameters.sqlFilters.length === 0 ? '' : ' AND ') + rowFilter)
  inputParameters.sqlReplacements.startDate = new Date(startDate).toISOString()
  inputParameters.sqlReplacements.finishDate = new Date(finishDate).toISOString()

  inputParameters.periodPresentation = periodPresentation
  inputParameters.filterPresentation = filterPresentation
}

async function transformResponseData(responseData) {
  let correctResponseData = []
  let lineNumber = 0

  for (let rec of responseData) {
    lineNumber += 1
    newRec = {
      lineNumber: lineNumber,
      numberDeliveryNote: rec.number,
      typeOfOperation: rec.type_of_operation,
      bruttoTime: rec.brutto_time,
      brutto: Number(rec.brutto).toFixed(3),
      tareTime: rec.tare_time,
      tare: Number(rec.tare).toFixed(3),
      netto: Number(rec.netto).toFixed(3),
      countRows: Number(1),
      comment: rec.comment,
    }

    newRec.vehicle = {
      id: rec.vehicle_id,
      name: rec.vehicle_name,
    }

    newRec.trailer = {
      id: rec.trailer_id,
      name: rec.trailer_name,
    }
    newRec.deliveryOrder = {
      id: rec.order_id,
      name: rec.order_name,
    }
    newRec.forwarder = {
      id: rec.forwarder_id,
      name: rec.forwarder_name,
    }
    newRec.customer = {
      id: rec.customer_id,
      name: rec.customer_name,
    }
    newRec.vendor = {
      id: rec.vendor_id,
      name: rec.vendor_name,
    }
    newRec.warehouse = {
      id: rec.warehouse_id,
      name: rec.warehouse_name,
    }
    newRec.scaleNetto = {
      id: rec.scale_netto_id,
      name: rec.scale_netto_name,
    }
    newRec.bruttoAuthor = {
      id: rec.brutto_author_id,
      name: rec.brutto_author_name,
    }
    newRec.tareAuthor = {
      id: rec.tare_author_id,
      name: rec.tare_author_name,
    }

    correctResponseData.push(newRec)
  }

  return correctResponseData
}

function formatDate(inputDate) {
  var d = new Date(inputDate)
  const date = [('0' + d.getDate()).slice(-2), ('0' + (d.getMonth() + 1)).slice(-2), d.getFullYear()].join('.')

  return date
}
