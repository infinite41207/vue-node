const sequelize = require('@database/dbConnection')
const logger = require('@logging/logger')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Raport rozmieszczenia samochodów'
    const periodType = 1
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
        property: 'author',
        description: 'Autor',
        title: 'Autor',
        sqlColumnName: 'users.name',
        valueType: 'object',
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
        property: 'date',
        description: 'Data',
        title: 'Data',
        sqlColumnName: 'disposition.date',
        valueType: 'date',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 3,
        sequence: 3,
        property: 'prefix',
        description: 'Prefix',
        title: 'Prefix',
        sqlColumnName: 'disposition.prefix',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 4,
        sequence: 4,
        property: 'status',
        description: 'Status',
        title: 'Status',
        sqlColumnName: 'statuses.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 5,
        sequence: 5,
        property: 'comment',
        description: 'Komentarz',
        title: 'Komentarz',
        sqlColumnName: 'disposition.comment',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 6,
        sequence: 6,
        property: 'numberOfWeighings',
        description: 'Wielokrotnosc',
        title: 'Wielokrotnosc',
        sqlColumnName: 'disposition."numberOfWeighings"',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 7,
        sequence: 7,
        property: 'numberOfWeighted',
        description: 'Wykonane',
        title: 'Wykonane',
        sqlColumnName: 'disposition."numberOfWeighted"',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 8,
        sequence: 8,
        property: 'productCondition',
        description: 'Stan produktu',
        title: 'Stan produktu',
        sqlColumnName: 'disposition."productCondition"',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 9,
        sequence: 9,
        property: 'quantity',
        description: 'Tonaz',
        title: 'Tonaz',
        sqlColumnName: 'disposition.quantity',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 10,
        sequence: 10,
        property: 'trainNumber',
        description: 'Numer pociagu',
        title: 'Numer pociagu',
        sqlColumnName: 'disposition."trainNumber"',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 11,
        sequence: 11,
        property: 'type',
        description: 'Rodzaj dyspozycji',
        title: 'Rodzaj dyspozycji',
        sqlColumnName: 'disposition.type',
        valueType: 'text',
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
        property: 'typeOfDocument',
        description: 'Rodzaj dokumentu',
        title: 'Rodzaj dokumentu',
        sqlColumnName: 'disposition."typeOfDocument"',
        valueType: 'text',
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
        property: 'typeOfOperation',
        description: 'Rodzaj operacji',
        title: 'Rodzaj operacji',
        sqlColumnName: 'disposition."typeOfOperation"',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 14,
        sequence: 14,
        property: 'driver',
        description: 'Kierowca',
        title: 'Kierowca',
        sqlColumnName: 'drivers.name',
        valueType: 'object',
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
        property: 'vehicle',
        description: 'Samochod',
        title: 'Samochod',
        sqlColumnName: 'vehicle.name',
        valueType: 'object',
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
        property: 'trailer',
        description: 'Naczepa',
        title: 'Naczepa',
        sqlColumnName: 'trailer.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 17,
        sequence: 17,
        property: 'customer',
        description: 'Odbiorca',
        title: 'Odbiorca',
        sqlColumnName: 'customers.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 18,
        sequence: 18,
        property: 'forwarder',
        description: 'Spedytor',
        title: 'Spedytor',
        sqlColumnName: 'forwarders.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 19,
        sequence: 19,
        property: 'vendor',
        description: 'Sprzedawca',
        title: 'Sprzedawca',
        sqlColumnName: 'vendors.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 20,
        sequence: 20,
        property: 'product',
        description: 'Towar',
        title: 'Towar',
        sqlColumnName: 'product.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 21,
        sequence: 21,
        property: 'schemeOfCargo',
        description: 'Relacja',
        title: 'Relacja',
        sqlColumnName: 'scheme.name',
        valueType: 'object',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
      {
        id: 22,
        sequence: 22,
        property: 'countRows',
        description: 'Ilosc',
        title: 'Ilosc',
        valueType: 'number',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 5,
      },
    ]

    //SUM, MIN, MAX, COUNT
    const summColumns = [{ name: 'rowsCount', operator: 'SUM' }]

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
            disposition.id, \
            disposition.date AS date, \
            disposition."arrivalDateDriver" AS "arrivalDateDriver", \
            disposition.prefix AS prefix, \
            disposition.comment AS comment, \
            disposition."numberOfWeighings" AS "numberOfWeighings", \
            disposition."numberOfWeighted" AS "numberOfWeighted", \
            disposition."productCondition" AS "productCondition", \
            disposition.quantity AS quantity, \
            disposition."trainNumber" AS "trainNumber", \
            disposition.type AS type,\
            disposition."typeOfDocument" as "typeOfDocument", \
            disposition."typeOfOperation" AS "typeOfOperation", \
            disposition."beginWeighting" AS beginWeighting, \
            disposition."endWeighting" AS endWeighting, \
            disposition.netto AS netto, \
            disposition.closed AS closed, \
            disposition.state AS state, \
            disposition.ratified AS ratified, \
            disposition."firstQuantity" AS firstQuantity, \
            disposition."advicesNumber" AS advicesNumber, \
            disposition."approvedDate" AS approvedDate, \
            disposition."deliveryNoteNumber" AS deliveryNoteNumber, \
            disposition."firstWeight" AS firstWeight, \
            disposition."arrivalDateDriver" AS arrivalDateDriver, \
            disposition.correspondence AS correspondence, \
            disposition."driverPhoneNumber" AS driverPhoneNumber, \
            disposition."carsQueueStatus" AS carsQueueStatus, \
            disposition."useResearch" AS useResearch, \
            disposition."researchResult" AS researchResult, \
            disposition."customsNumber" AS customsNumber, \
            disposition."dateIssueDSK" AS dateIssueDSK, \
            disposition."barCode" AS barCode, \
            disposition."driverTicket" AS driverTicket, \
            disposition."entryTicket" AS entryTicket, \
            disposition."trailerId" AS "trailerId", \
            trailer.name AS "trailerName", \
            disposition."vehicleId" AS "vehicleId", \
            vehicle.name AS "vehicleName", \
            disposition."customerId" AS "customerId", \
            customer.name AS "customerName", \
            disposition."forwarderId" AS "forwarderId", \
            forwarder.name AS "forwarderName", \
            disposition."authorId" AS "authorId", \
            users.name AS "authorName", \
            disposition."driverId" AS "driverId", \
            driver.name AS "driverName", \
            disposition."productId" AS "productId", \
            product.name AS "productName", \
            disposition."schemeOfCargoId" AS "schemeId", \
            scheme.name AS "schemeName", \
            disposition."vendorId" AS "vendorId", \
            vendor.name AS "vendorName", \
            disposition."statusId" AS "statusId", \
            statuses.name AS "statusName" \
        FROM \
            dispositions as disposition \
            left join vehicles as vehicle \
            ON disposition."vehicleId" = vehicle.id \
            left join vehicles as trailer \
            ON disposition."trailerId" = trailer.id \
            left join vendor_and_customers as customer \
            ON disposition."customerId" = customer.id \
            left join vendor_and_customers as forwarder \
            ON disposition."forwarderId" = forwarder.id \
            left join drivers as driver \
            ON disposition."driverId" = driver.id \
            left join users as users \
            ON disposition."authorId" = users.id \
            left join products as product \
            ON disposition."productId" = product.id \
            left join schemes_of_cargo as scheme \
            ON disposition."schemeOfCargoId" = scheme.id \
            left join vendor_and_customers as vendor \
            ON disposition."vendorId" = vendor.id \
            left join disp_statuses as statuses \
            ON disposition."statusId" = statuses.id \
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

  rowFilter = 'disposition.date BETWEEN :startDate AND :finishDate'
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
      date: rec.date,
      prefix: rec.prefix,
      comment: rec.comment,
      numberOfWeighings: rec.numberOfWeighings,
      numberOfWeighted: rec.numberOfWeighted,
      productCondition: rec.productCondition,
      quantity: rec.quantity,
      trainNumber: rec.trainNumber,
      type: rec.type,
      typeOfDocument: rec.typeOfDocument,
      typeOfOperation: rec.typeOfOperation,
      countRows: Number(1),
    }

    newRec.trailer = {
      id: rec.trailerId,
      name: rec.trailerName,
    }

    newRec.vehicle = {
      id: rec.vehicleId,
      name: rec.vehicleName,
    }

    newRec.customer = {
      id: rec.customerId,
      name: rec.customerName,
    }

    newRec.forwarder = {
      id: rec.forwarderId,
      name: rec.forwarderName,
    }

    newRec.vendor = {
      id: rec.vendorId,
      name: rec.vendorName,
    }

    newRec.author = {
      id: rec.authorId,
      name: rec.authorName,
    }

    newRec.driver = {
      id: rec.driverId,
      name: rec.driverName,
    }

    newRec.product = {
      id: rec.productId,
      name: rec.productName,
    }

    newRec.schemeOfCargo = {
      id: rec.schemeId,
      name: rec.schemeName,
    }

    newRec.status = {
      id: rec.statusId,
      name: rec.statusName,
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
