const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Raport z reklamacji'
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
        property: 'reclamationNumber',
        description: 'Numer reklamacji',
        title: 'Nr reklamacji',
        sqlColumnName: 'reclamations.number',
        valueType: 'number',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 2,
        sequence: 2,
        property: 'customer',
        description: 'Klient',
        title: 'Klient',
        sqlColumnName: 'reclamations."customerId"',
        valueType: 'object',
        type: 'counterparties',
        action: 'getAllCustomers',
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
        property: 'clientName',
        description: 'Imię klienta',
        title: 'Imię klienta',
        sqlColumnName: 'reclamations."clientName"',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'telephone',
        description: 'Telefon',
        title: 'Telefon',
        sqlColumnName: 'reclamations.telephone',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'email',
        description: 'Email',
        title: 'Email',
        sqlColumnName: 'reclamations.email',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'postCode',
        description: 'Kod pocztowy',
        title: 'Kod pocztowy',
        sqlColumnName: 'reclamations."postCode"',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'city',
        description: 'Miasto',
        title: 'Miasto',
        sqlColumnName: 'reclamations.city',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'address',
        description: 'Adres',
        title: 'Adres',
        sqlColumnName: 'reclamations.address',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'comment',
        description: 'Komentarz',
        title: 'Komentarz',
        sqlColumnName: 'reclamations.comment',
        valueType: 'text',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 10,
        sequence: 10,
        property: 'deliveryStatus',
        description: 'Status przesyłki',
        title: 'Status przesyłki',
        sqlColumnName: 'reclamations."deliveryStatus"',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'amount',
        description: 'Ilość',
        title: 'Ilość',
        sqlColumnName: 'reclamations.amount',
        valueType: 'number',
        textAlign: 'centerAlign',
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
        property: 'deliveryAddress',
        description: 'Adres dostawy',
        title: 'Adres dostawy',
        sqlColumnName: 'reclamations."deliveryAddress"',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'deliveryDate',
        description: 'Data dostawy',
        title: 'Data dostawy',
        sqlColumnName: 'reclamations."deliveryDate"',
        valueType: 'date',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 14,
        sequence: 14,
        property: 'status',
        description: 'Status reklamacji',
        title: 'Status reklamacji',
        sqlColumnName: 'reclamations."statusId"',
        valueType: 'object',
        type: 'reclamationStatuses',
        action: 'getAllRecStatuses',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 15,
        sequence: 15,
        property: 'salesDate',
        description: 'Data sprzedaży',
        title: 'Data sprzedaży',
        sqlColumnName: 'reclamations."salesDate"',
        valueType: 'date',
        textAlign: 'centerAlign',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
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
            reclamations.id, \
            reclamations.number AS number, \
            reclamations."customerId" as customer_id, \
            counterparties.name as customer_name ,\
            reclamations."clientName" as client_name , \
            reclamations."postCode" as post_code , \
            reclamations.city as city , \
            reclamations.email as email , \
            reclamations.telephone as telephone , \
            reclamations.address as address , \
            reclamations.comment as comment , \
            reclamations."deliveryStatus" as delivery_status , \
            reclamations.amount as amount ,\
            reclamations."deliveryAddress" as delivery_address , \
            reclamations."deliveryDate" as delivery_date ,\
            reclamations."statusId" as status_id ,\
            reclamation_statuses.description as status_name , \
            reclamations."salesDate" as sales_date \
        FROM \
            reclamations as reclamations \
            left join counterparties as counterparties \
            ON reclamations."customerId" = counterparties.id \
            left join reclamation_statuses as reclamation_statuses \
            ON reclamations."statusId" = reclamation_statuses.id \
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

  rowFilter = 'reclamations."inputDate" BETWEEN :startDate AND :finishDate'
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
      reclamationNumber: rec.number,
      clientName: rec.client_name,
      telephone: rec.telephone,
      city: rec.city,
      email: rec.email,
      postCode: rec.post_code,
      address: rec.address,
      comment: rec.comment,
      deliveryStatus: rec.delivery_status,
      amount: rec.amount,
      deliveryAddress: rec.delivery_address,
      deliveryDate: rec.delivery_date ? moment(rec.delivery_date).format('DD.MM.YYYY HH:mm:ss') : '',
      salesDate: rec.sales_date ? moment(rec.sales_date).format('DD.MM.YYYY HH:mm:ss') : '',
    }

    newRec.customer = {
      id: rec.customer_id,
      name: rec.customer_name,
    }

    newRec.status = {
      id: rec.status_id,
      name: rec.status_name,
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
