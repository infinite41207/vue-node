const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Raport zmianowy BTS'
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
        property: 'weightingDate',
        description: 'Data ważenia',
        title: 'Data ważenia',
        sqlColumnName: 'delivery_notes."bruttoTime"',
        valueType: 'text',
        textAlign: 'leftAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 2,
        sequence: 2,
        property: 'disposition',
        description: 'Numer dyspozycji',
        title: 'Nr dyspozycji',
        sqlColumnName: 'delivery_notes."dispositionId"',
        valueType: 'object',
        action: 'getAllDispositions',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 3,
      },
      {
        id: 3,
        sequence: 3,
        property: 'numberDeliveryNote',
        description: 'Numer kwitu wagowego',
        title: 'Nr kwitu wagowego',
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
        id: 4,
        sequence: 4,
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
        id: 5,
        sequence: 5,
        property: 'trailer',
        description: 'Naczepa',
        title: 'Naczepa',
        sqlColumnName: 'delivery_notes."trailerId"',
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
        id: 6,
        sequence: 6,
        property: 'ship',
        description: 'Statek',
        title: 'Nazwa statku',
        sqlColumnName: 'delivery_notes."shipId"',
        valueType: 'object',
        action: 'getAllShips',
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
        property: 'tareTime',
        description: 'Godzina tarowania',
        title: 'Godzina tarowania',
        sqlColumnName: 'delivery_notes."tareTime"',
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
        id: 8,
        sequence: 8,
        property: 'bruttoTime',
        description: 'Godzina załadunku',
        title: 'Godzina załadunku',
        sqlColumnName: 'delivery_notes."bruttoTime"',
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
        id: 9,
        sequence: 9,
        property: 'quantity',
        description: 'Tonaż',
        title: 'Tonaż [t]',
        sqlColumnName: 'delivery_notes.quantity',
        valueType: 'number',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 3,
      },
      {
        id: 10,
        sequence: 10,
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
        id: 11,
        sequence: 11,
        property: 'vendor',
        description: 'Dostawca',
        title: 'Nazwa dostawcy',
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
        id: 12,
        sequence: 12,
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
        id: 13,
        sequence: 13,
        property: 'comment',
        description: 'Komentarz',
        title: 'Komentarz',
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
            delivery_notes."customerId" as customer_id, \
            counterparties.name as customer_name, \
            delivery_notes."vendorId" as vendor_id, \
            vendors.name as vendor_name, \
            delivery_notes."warehouseId" as warehouse_id, \
            warehouses.name as warehouse_name, \
            delivery_notes.comment AS comment, \
            delivery_notes."dispositionId" as disposition_id ,\
            dispositions.number as disposition_number , \
            delivery_notes."trailerId" as trailer_id,\
            vehicles.name as trailer_name,\
            delivery_notes."shipId" as ship_id ,\
            ships.name as ship_name ,\
            delivery_notes."bruttoTime" ,\
            delivery_notes."tareTime" ,\
            delivery_notes.quantity \
        FROM \
            delivery_notes as delivery_notes \
            left join dispositions as dispositions \
            ON delivery_notes."dispositionId" = dispositions.id \
            left join transport_orders as transport_orders \
            ON dispositions."orderId" = transport_orders.id \
            left join vehicles as vehicles \
            ON delivery_notes."vehicleId" = vehicles.id \
            left join vendor_and_customers as forwarders \
            ON delivery_notes."forwarderId" = forwarders.id \
            left join vendor_and_customers as counterparties \
            ON delivery_notes."customerId" = counterparties.id \
            left join vendor_and_customers as vendors \
            ON delivery_notes."vendorId" = vendors.id \
            left join warehouses as warehouses \
            ON delivery_notes."warehouseId" = warehouses.id \
            left join ships as ships \
            ON delivery_notes."shipId" = ships.id\
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
      idCard: rec.driver_idcard,
      tareTime: rec.tare_time,
      tare: Number(rec.tare).toFixed(3),
      netto: Number(rec.netto).toFixed(3),
      countRows: Number(1),
      comment: rec.comment,
      bruttoTime: moment(rec.bruttoTime).format('LTS'),
      tareTime: moment(rec.tareTime).format('LTS'),
      weightingDate: moment(rec.bruttoTime).format('L'),
      quantity: rec.quantity,
    }

    newRec.vehicle = {
      id: rec.vehicle_id,
      name: rec.vehicle_name,
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

    newRec.disposition = {
      id: rec.disposition_id,
      name: rec.disposition_number,
    }

    newRec.trailer = {
      id: rec.trailer_id,
      name: rec.trailer_name,
    }

    newRec.ship = {
      id: rec.ship_id,
      name: rec.ship_name,
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
