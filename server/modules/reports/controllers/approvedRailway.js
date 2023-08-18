const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Zestawienie wagonów przyjętych'
    const periodType = 1
    const showYTotal = true
    const showXTotal = true

    const columns = [
      {
        index: 0,
        sequence: 0,
        property: 'lineNumber',
        description: 'Nr',
        title: 'L. p.',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 1,
        sequence: 1,
        property: 'date',
        description: 'Data przyjęcia',
        title: 'Data przyjęcia',
        sqlColumnName: 'delivery_notes.date',
        valueType: 'date',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 3,
      },
      {
        index: 2,
        sequence: 2,
        property: 'vehicle',
        description: 'Numer wagonu',
        title: 'Numer wagonu',
        sqlColumnName: 'vehicles.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 3,
        sequence: 3,
        property: 'order',
        description: 'Zlecenie',
        title: 'Zlecenie',
        sqlColumnName: 'transport_orders.number',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 4,
        sequence: 4,
        property: 'disposition',
        description: 'Nr dyspozycji',
        title: 'Nr dyspozycji',
        sqlColumnName: 'disposition.number',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 5,
        sequence: 5,
        property: 'product',
        description: 'Towar',
        title: 'Towar',
        sqlColumnName: 'products.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 6,
        sequence: 6,
        property: 'warehouse',
        description: 'Magazyn',
        title: 'Magazyn',
        sqlColumnName: 'warehouses.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 7,
        sequence: 7,
        property: 'netto',
        description: 'Netto',
        title: 'Netto',
        sqlColumnName: 'delivery_notes.netto',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 8,
        sequence: 8,
        property: 'forwarder',
        description: 'Spedytor',
        title: 'Spedytor',
        sqlColumnName: 'vendor_and_customers.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 9,
        sequence: 9,
        property: 'advicesNumber',
        description: 'Nr awiza',
        title: 'Nr awiza',
        sqlColumnName: 'dispositions."advicesNumber"',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 10,
        sequence: 10,
        property: 'mine',
        description: 'Kopalnia',
        title: 'Kopalnia',
        sqlColumnName: 'mines.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 11,
        sequence: 11,
        property: 'assortment',
        description: 'Sortyment',
        title: 'Sortyment',
        sqlColumnName: 'assortments.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 12,
        sequence: 12,
        property: 'disposition',
        description: 'Nr dyspozycji',
        title: 'Nr dyspozycji',
        sqlColumnName: 'disposition.number',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 13,
        sequence: 13,
        property: 'ship',
        description: 'Statek',
        title: 'Statek',
        sqlColumnName: 'ships.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 14,
        sequence: 14,
        property: 'vendor',
        description: 'Dostawca',
        title: 'Dostawca',
        sqlColumnName: 'vendor_and_customers.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 15,
        sequence: 15,
        property: 'customer',
        description: 'Odbiorca',
        title: 'Odbiorca',
        sqlColumnName: 'vendor_and_customers.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 16,
        sequence: 16,
        property: 'approvedAuthor',
        description: 'Przyjął',
        title: 'Przyjął',
        sqlColumnName: 'users.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        index: 17,
        sequence: 17,
        property: 'number',
        description: 'Nr listu przewozowego',
        title: 'Nr listu przewozowego',
        sqlColumnName: 'delivery_notes.number',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
    ]

    //SUM, MIN, MAX, COUNT
    const summColumns = [{ name: 'netto', operator: 'SUM' }]

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

    console.log(resposeDataSet.resultData)

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
            delivery_notes.date AS date, \
            delivery_notes."vehicleId" AS "vehicleId", \
            vehicles.name AS "vehicleName", \
            delivery_notes."dispositionId" AS "dispositionId", \
            dispositions.number AS "dispositionNumber", \
            dispositions."orderId" AS "orderId", \
            transport_orders.number AS "orderNumber", \
            delivery_notes."productId" AS "productId", \
            products.name AS "productName", \
            delivery_notes."warehouseId" AS "warehouseId", \
            warehouses.name AS "warehouseName", \
            delivery_notes.netto AS netto, \
            delivery_notes."forwarderId" AS "forwarderId", \
            forwarders.name AS "forwarderName", \
            dispositions."advicesNumber" AS "advicesNumber", \
            delivery_notes."mineId" AS "mineId", \
            mines.name AS "mineName", \
            dispositions."assortmentId" AS "assortmentId", \
            assortments.name AS "assortmentName", \
            delivery_notes."shipId" AS "shipId", \
            ships.name AS "shipName", \
            delivery_notes."vendorId" AS "vendorId", \
            vendors.name AS "vendorName", \
            delivery_notes."customerId" AS "customerId", \
            counterparties.name AS "customerName", \
            delivery_notes."approvedAuthorId" AS "approvedAuthorId", \
            users.name AS "approvedAuthorName", \
            delivery_notes.number AS number \
        FROM \
            delivery_notes AS delivery_notes \
            LEFT JOIN vehicles AS vehicles \
            ON delivery_notes."vehicleId" = vehicles.id \
            LEFT JOIN dispositions AS dispositions \
            ON delivery_notes."dispositionId" = dispositions.id \
            LEFT JOIN transport_orders AS transport_orders \
            ON dispositions."orderId" = transport_orders.id \
            LEFT JOIN products AS products \
            ON delivery_notes."productId" = products.id \
            LEFT JOIN warehouses AS warehouses \
            ON delivery_notes."warehouseId" = warehouses.id \
            LEFT JOIN vendor_and_customers AS forwarders \
            ON delivery_notes."forwarderId" = forwarders.id \
            LEFT JOIN mines AS mines \
            ON delivery_notes."mineId" = mines.id \
            LEFT JOIN assortments AS assortments \
            ON dispositions."assortmentId" = assortments.id \
            LEFT JOIN ships AS ships \
            ON delivery_notes."shipId" = ships.id \
            LEFT JOIN vendor_and_customers AS vendors \
            ON delivery_notes."vendorId" = vendors.id \
            LEFT JOIN vendor_and_customers AS counterparties \
            ON delivery_notes."customerId" = counterparties.id \
            LEFT JOIN users AS users \
            ON delivery_notes."approvedAuthorId" = users.id \
        WHERE'

  for (let filter of filters) {
    queryText =
      queryText +
      ' \
                ' +
      filter
  }

  return await sequelize.query(queryText, { type: QueryTypes.SELECT, replacements })
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
      id: rec.id,
      date: rec.date ? moment(rec.date).format('DD.MM.YYYY HH:mm:ss') : '',
      netto: Number(rec.netto),
      advicesNumber: rec.advicesNumber,
      number: rec.number,
    }

    newRec.vehicle = {
      id: rec.vehicleId,
      name: rec.vehicleName,
    }

    newRec.disposition = {
      id: rec.dispositionId,
      name: rec.dispositionNumber,
    }

    newRec.order = {
      id: rec.orderId,
      name: rec.orderNumber,
    }

    newRec.product = {
      id: rec.productId,
      name: rec.productName,
    }

    newRec.warehouse = {
      id: rec.warehouseId,
      name: rec.warehouseName,
    }

    newRec.forwarder = {
      id: rec.forwarderId,
      name: rec.forwarderName,
    }

    newRec.mine = {
      id: rec.mineId,
      name: rec.mineName,
    }

    newRec.assortment = {
      id: rec.assortmentId,
      name: rec.assortmentName,
    }

    newRec.ship = {
      id: rec.shipId,
      name: rec.shipName,
    }

    newRec.vendor = {
      id: rec.vendorId,
      name: rec.vendorName,
    }

    newRec.customer = {
      id: rec.customerId,
      name: rec.customerName,
    }

    newRec.approvedAuthor = {
      id: rec.approvedAuthorId,
      name: rec.approvedAuthorName,
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
