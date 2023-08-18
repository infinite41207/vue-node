const sequelize = require('@database/dbConnection')
const logger = require('@logging/logger')
const { Op } = require('sequelize')
const { QueryTypes } = require('sequelize')

const Customer = require('@catalogs/counterparties/models')
const User = require('@catalogs/users/models')

const ReclamationType = require('@catalogs/reclamationTypes/models')
const ExecutionType = require('@catalogs/reclamationExecutionTypes/models')
const Decision = require('@catalogs/reclamationDecisions/models')
const Status = require('@catalogs/reclamationStatuses/models')
const ReclamationReason = require('@catalogs/reclamationReasons/models')

const documentService = require('@services/documentsService')
const customerRequestModel = require('@documents/customerRequests/models/customerRequest')

function transformInputFilter(inputParameters) {
  inputParameters.sqlFilterArray = []
  inputParameters.sqlReplacements = {}

  let newFilter = ''

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
  const filtersArray = inputParameters.filtersArray
  for (let filter of filtersArray) {
    if ((filter.use === true || filter.use === 'true') && filter.value) {
      let columnName = filter.sqlColumnName
      let valuePresentation = filter.value
      if (filter.valueType === 'object') {
        if (filter.operator === '=') {
          rowFilter = columnName + filter.operator + filter.value.id
          valuePresentation = filter.value[filter.columnName]
        } else if (filter.operator === 'Na liście') {
          let arrayIds = []
          let arrayNames = []
          for (let rowValue of filter.value) {
            arrayIds.push(rowValue.id)
            arrayNames.push(rowValue[filter.columnName])
          }
          rowFilter = columnName + ' = ANY (ARRAY[' + arrayIds.toString() + '])'
          valuePresentation = '[' + arrayNames.toString() + ']'
        }
      } else if (filter.valueType === 'enum') {
        if (filter.operator === '=') {
          rowFilter = columnName + filter.operator + filter.value.id
          valuePresentation = filter.value[filter.columnName]
        } else if (filter.operator === 'Na liście') {
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
      inputParameters.sqlFilterArray.push((inputParameters.sqlFilterArray.length === 0 ? '' : ' AND ') + rowFilter)

      filterPresentation += filterPresentation === '' ? '' : '; '
      filterPresentation += filter.description + ' ' + filter.operator + ' ' + valuePresentation
    }
  }

  rowFilter = 'customer_requests."createdAt" BETWEEN :startDate AND :finishDate'
  inputParameters.sqlFilterArray.push((inputParameters.sqlFilterArray.length === 0 ? '' : ' AND ') + rowFilter)
  inputParameters.sqlReplacements.startDate = new Date(startDate).toISOString()
  inputParameters.sqlReplacements.finishDate = new Date(finishDate).toISOString()

  rowFilter = 'customer_requests.state=' + "'" + 'Active' + "'"
  inputParameters.sqlFilterArray.push((inputParameters.sqlFilterArray.length === 0 ? '' : ' AND ') + rowFilter)

  inputParameters.periodPresentation = periodPresentation
  inputParameters.filterPresentation = filterPresentation
}

function formatDate(inputDate) {
  var d = new Date(inputDate)
  const date = [('0' + d.getDate()).slice(-2), ('0' + (d.getMonth() + 1)).slice(-2), d.getFullYear()].join('.')

  return date
}

async function getQueryRecordsDetail(filtersArray, objReplacements) {
  let a = 0
  let queryText =
    '\
        SELECT \
            customer_requests.id, \
            customer_requests."numberStr" AS number_str, \
            customer_requests."createdAt" AS created_at, \
            customer_requests.reference AS reference, \
            customer_requests.tags AS tags, \
            customer_requests.commission AS commission, \
            customer_requests."executionTerm" AS executionTerm, \
            customer_requests."sendingDate" AS sending_date, \
            customer_requests."sumBrutto" AS sum_brutto, \
            customer_requests."statusId" AS status_id, \
            statuses.description AS status_name, \
            customer_requests."customerId" AS customer_id, \
            counterparties.name AS customer_name, \
            customer_requests."constructorId" AS constructor_id, \
            constructors.name AS constructor_name, \
            customer_requests."managerId" AS manager_id, \
            managers.name AS manager_name, \
            orders.number AS orderNumber\
        FROM \
            customer_requests as customer_requests \
            left join customer_request_statuses as statuses \
            ON customer_requests."statusId" = statuses.id \
            left join counterparties as counterparties \
            ON customer_requests."customerId" = counterparties.id \
            left join users as constructors \
            ON customer_requests."constructorId" = constructors.id \
            left join employees as managers \
            ON customer_requests."managerId" = managers.id \
            left join orders as orders \
            ON customer_requests."orderId" = orders.id \
        WHERE'

  for (let rowFilter of filtersArray) {
    queryText =
      queryText +
      ' \
                ' +
      rowFilter
  }

  const responseData = await sequelize.query(queryText, { type: QueryTypes.SELECT, replacements: objReplacements })
  return responseData
}

function transformResponseData(responseData) {
  let correctResponseData = []
  let lineNumber = 0

  for (let rec of responseData) {
    lineNumber += 1
    newRec = {
      lineNumber: lineNumber,
      id: rec.id,
      numberStr: rec.number_str,
      createdAt: rec.created_at,
      executionTerm: rec.executionTerm,
      sendingDate: rec.sending_date,
      reference: rec.reference,
      tags: rec.tags,
      orderNumber: rec.orderNumber,
      // commission:             Number(rec.commission).toFixed(2),
      // sumBrutto:              Number(rec.sum_brutto).toFixed(2),
      countRows: Number(1),
    }

    newRec.status = {
      id: rec.status_id,
      name: rec.status_name,
    }
    newRec.customer = {
      id: rec.customer_id,
      name: rec.customer_name,
    }
    newRec.constructor_ = {
      id: rec.constructor_id,
      name: rec.constructor_name,
    }
    newRec.manager = {
      id: rec.manager_id,
      name: rec.manager_name,
    }

    correctResponseData.push(newRec)
  }

  return correctResponseData
}

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Analiza zapytań ofertowych'

    // periodType: 0 - date, 1 - period
    const periodType = 1

    const columnsArray = [
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
        property: 'numberStr',
        description: 'Numer',
        title: 'Numer',
        sqlColumnName: 'customer_requests."numberStr"',
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
        property: 'status',
        description: 'Status',
        title: 'Status',
        sqlColumnName: 'customer_requests."statusId"',
        valueType: 'object',
        action: 'getAllCustomRequestStatuses',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 7,
      },
      {
        id: 3,
        sequence: 3,
        property: 'constructor_',
        description: 'Konstruktor',
        title: 'Konstruktor',
        sqlColumnName: 'customer_requests."constructorId"',
        valueType: 'object',
        action: 'getAllUsers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 7,
      },
      {
        id: 4,
        sequence: 4,
        property: 'reference',
        description: 'Referencja',
        title: 'Referencja',
        sqlColumnName: 'customer_requests.reference',
        valueType: 'text',
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
        property: 'tags',
        description: 'Tagi',
        title: 'Tagi',
        sqlColumnName: 'customer_requests.tags',
        valueType: 'text',
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
        description: 'Klient',
        title: 'Klient',
        sqlColumnName: 'customer_requests."customerId"',
        valueType: 'object',
        action: 'getAllCustomers',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 10,
      },
      {
        id: 7,
        sequence: 7,
        property: 'manager',
        description: 'Handlowiec',
        title: 'Handlowiec',
        sqlColumnName: 'customer_requests."managerId"',
        valueType: 'object',
        action: 'getAllEmployees',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 10,
      },
      {
        id: 8,
        sequence: 8,
        property: 'createdAt',
        description: 'Utworzono',
        title: 'Utworzono',
        sqlColumnName: 'customer_requests."createdAt"',
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
        id: 9,
        sequence: 9,
        property: 'executionTerm',
        description: 'Termin wykonania',
        title: 'Termin wykonania',
        sqlColumnName: 'customer_requests."executionTerm"',
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
        id: 10,
        sequence: 10,
        property: 'sendingDate',
        description: 'Data wysłania',
        title: 'Data wysłania',
        sqlColumnName: 'customer_requests."sendingDate"',
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
        id: 11,
        sequence: 11,
        property: 'orderNumber',
        description: 'Nr zamówienia',
        title: 'Nr zamówienia',
        sqlColumnName: 'orders.number',
        valueType: 'text',
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
        property: 'sumBrutto',
        description: 'Kwota oferty',
        title: 'Kwota oferty',
        sqlColumnName: 'customer_requests."sumBrutto"',
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
        id: 13,
        sequence: 13,
        property: 'countRows',
        description: 'Ilość',
        title: 'Ilość',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: true,
        groupDisabled: true,
        width: 3,
      },
    ]

    //SUM, MIN, MAX, COUNT
    const summColumnsArray = [
      { name: 'countRows', operator: 'SUM' },
      // { name: 'sumBrutto'     , operator: 'SUM' },
    ]

    const addClasses = {
      // 'all/11,13,14': {
      //     'rightAlign': true,
      // },
      //  'all/1_11,12': {
      //     'centerAlign': true,
      // },
      // 'all/2': {
      //     'wrapText': true,
      // },
    }

    const returnParameters = {
      reportName: reportName,
      periodType: periodType,
      columnsArray: columnsArray,
      summColumnsArray: summColumnsArray,
      addClasses: addClasses,
    }

    res.status(200).send(returnParameters)
  },

  async getDataReport(req, res, next) {
    let inputParameters = req.body.reportParameters

    transformInputFilter(inputParameters)

    let responseData = await getQueryRecordsDetail(inputParameters.sqlFilterArray, inputParameters.sqlReplacements)
    responseData = transformResponseData(responseData)

    // console.log('responseData - ', JSON.stringify(responseData, null, 2));

    let resposeDataSet = {}

    resposeDataSet['recordsDetail'] = responseData
    resposeDataSet['periodPresentation'] = inputParameters.periodPresentation
    resposeDataSet['filterPresentation'] = inputParameters.filterPresentation

    // console.log('responseData - ', JSON.stringify(responseData, null, 2));

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
