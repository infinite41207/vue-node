const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Rejestr zamówień'
    const periodType = 1
    const showYTotal = true
    const showXTotal = true

    const columns = [
      {
        index: 0,
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
        index: 1,
        property: 'number',
        description: 'Zlececenie',
        title: 'Nr zlececenia',
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
        index: 2,
        property: 'createdAt',
        description: 'Data',
        title: 'Data',
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
        index: 3,
        property: 'customer',
        description: 'Odbiorca',
        title: 'Odbiorca',
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
        index: 4,
        property: 'author',
        description: 'Użytkownik',
        title: 'Użytkownik',
        valueType: 'object',
        action: 'getAll',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 8,
      },
      {
        index: 5,
        property: 'currency',
        description: 'Waluta',
        title: 'Waluta',
        valueType: 'text',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        index: 6,
        property: 'sumBrutto',
        description: 'Brutto',
        title: 'Brutto',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: true,
        width: 8,
      },
      {
        index: 7,
        property: 'sumVat',
        description: 'VAT',
        title: 'VAT',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: true,
        width: 8,
      },
      {
        index: 8,
        property: 'sumNetto',
        description: 'Netto',
        title: 'Netto',
        valueType: 'number',
        textAlign: 'rightAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: true,
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
            orders.id, \
            orders."customerId" as customer_id, \
            counterparties.name as customer_name, \
            orders.number as number, \
            orders."createdAt" as created_at ,\
            orders."authorId" as author_id , \
            users.name as author_name ,\
            orders."currencyId" as currency_id ,\
            currencies.name as currency_name , \
            orders."sumBrutto" as sum_brutto, \
            orders."sumNetto" as sum_netto \
        FROM \
            orders as orders \
            left join counterparties as counterparties \
            ON orders."customerId" = counterparties.id \
            left join users as users \
            ON orders."authorId" = users.id \
            left join currencies as currencies \
            ON orders."currencyId" = currencies.id \
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
          rowFilter = `${columnName} ${filter.operator} '${filter.value.id}'`
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

  console.log(inputParameters.sqlFilters)

  rowFilter = 'orders."createdAt" BETWEEN :startDate AND :finishDate'
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
      number: rec.number,
      createdAt: rec.created_at,
    }

    newRec.customer = {
      id: rec.customer_id,
      name: rec.customer_name,
    }

    newRec.currency = {
      id: rec.currency_id,
      name: rec.currency_name,
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
