const sequelize = require('@database/dbConnection')
const moment = require('moment')
const { QueryTypes } = require('sequelize')

module.exports = {
  getStartData(req, res, next) {
    const reportName = 'Raport po dyspozycjach'
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
        property: 'date',
        description: 'Data',
        title: 'Data',
        sqlColumnName: 'dispositions.date',
        valueType: 'date',
        textAlign: 'centerAlign',
        format: 'DD.MM.YYYY HH:mm:ss',
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
        property: 'number',
        description: 'Numer',
        title: 'Numer',
        sqlColumnName: 'dispositions.number',
        valueType: 'text',
        textAlign: 'centerAlign',
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
        property: 'numberOfWeighings',
        description: 'Wielokrotność',
        title: 'Wielokrotność',
        sqlColumnName: 'dispositions."numberOfWeighings"',
        valueType: 'number',
        textAlign: 'centerAlign',
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
        property: 'numberOfWeighted',
        description: 'Wykonane',
        title: 'Wykonane',
        sqlColumnName: 'dispositions."numberOfWeighted"',
        valueType: 'number',
        textAlign: 'centerAlign',
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
        property: 'vehicle',
        description: 'Samohód',
        title: 'Nr samohodu',
        sqlColumnName: 'dispositions."vehicleId"',
        valueType: 'object',
        type: 'vehicles',
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
        property: 'type',
        description: 'Dyspozycja',
        title: 'Dyspozycja',
        sqlColumnName: 'dispositions.type',
        valueType: 'text',
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
        property: 'schemeOfCargo',
        description: 'Relacja',
        title: 'Relacja',
        sqlColumnName: 'dispositions."schemeOfCargoId"',
        valueType: 'object',
        type: 'schemeOfCargo',
        action: 'getAllschemeOfCargos',
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
        property: 'product',
        description: 'Towar',
        title: 'Towar',
        sqlColumnName: 'dispositions."productId"',
        valueType: 'object',
        type: 'product',
        action: 'getAllProducts',
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
        property: 'order',
        description: 'Zlecenia',
        title: 'Zlecenia',
        sqlColumnName: 'dispositions."orderId"',
        valueType: 'object',
        type: 'order',
        action: 'getAllTransportOrders',
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
        property: 'ship',
        description: 'Statek',
        title: 'Statek',
        sqlColumnName: 'dispositions."shipId"',
        valueType: 'object',
        type: 'ship',
        action: 'getAllShips',
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
        property: 'warehouse',
        description: 'Magazyn / Plac',
        title: 'Magazyn / Plac',
        sqlColumnName: 'dispositions."warehouseId"',
        valueType: 'object',
        type: 'warehouse',
        action: 'getAllWarehouses',
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
        property: 'forwarder',
        description: 'Spedytor',
        title: 'Spedytor',
        sqlColumnName: 'dispositions."forwarderId"',
        valueType: 'object',
        type: 'forwarder',
        action: 'getAllForwarders',
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
        property: 'weighing_station',
        description: 'Stanowisko wagowe',
        title: 'Stanowisko wagowe',
        sqlColumnName: 'dispositions."weighingStationId"',
        valueType: 'object',
        type: 'weighing_station',
        action: 'getAllweighinSstations',
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
        property: 'scale',
        description: 'Waga',
        title: 'Waga',
        sqlColumnName: 'dispositions."scaleId"',
        valueType: 'object',
        type: 'scale',
        action: 'getAllScales',
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
        property: 'vendor',
        description: 'Dostawca',
        title: 'Dostawca',
        sqlColumnName: 'dispositions."vendorId"',
        valueType: 'object',
        type: 'vendor',
        action: 'getAllVendors',
        visible: true,
        filterable: false,
        groupable: false,
        filterDisabled: false,
        groupDisabled: false,
        width: 5,
      },
      {
        id: 16,
        sequence: 16,
        property: 'author',
        description: 'Dyspozycję wystawił',
        title: 'Dyspozycję wystawił',
        sqlColumnName: 'dispositions."authorId"',
        valueType: 'object',
        type: 'author',
        action: 'getAllAuthors',
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
            dispositions.id , \
            dispositions.date as date , \
            dispositions.number as number ,\
            dispositions."numberOfWeighings" as "numberOfWeighings" ,\
            dispositions."numberOfWeighted" as "numberOfWeighted" ,\
            dispositions.type as type ,\
            dispositions."vehicleId" as vehicle_id, \
            vehicles.name as vehicle_name , \
            dispositions."schemeOfCargoId" as scheme_of_cargo_id, \
            schemes_of_cargo.name as scheme_of_cargo_name, \
            dispositions."productId" as product_id, \
            products.name as product_name ,\
            dispositions."orderId" as order_id, \
            transport_orders.number as order_number, \
            dispositions."shipId" as ship_id ,\
            ships.name as ship_name ,\
            dispositions."warehouseId" as warehouse_id , \
            warehouses.name as warehouse_name , \
            dispositions."forwarderId" as forwarder_id ,\
            vendor_and_customers.name as forwarder_name ,\
            dispositions."scaleId" as scale_id ,\
            scales.name as scale_name,\
            dispositions."weighingStationId" as weighing_station_id ,\
            weighing_stations.name as weighing_station_name ,\
            dispositions."vendorId" as vendor_id ,\
            vendor_and_customers.name as vendor_name , \
            dispositions."authorId" as author_id ,\
            users.name as author_name\
            \
        FROM \
            dispositions as dispositions \
            left join vehicles as vehicles \
            ON dispositions."vehicleId" = vehicles.id \
            left join schemes_of_cargo as schemes_of_cargo \
            ON dispositions."schemeOfCargoId" = schemes_of_cargo.id \
            left join products as products \
            ON dispositions."productId" = products.id \
            left join transport_orders as transport_orders \
            ON dispositions."orderId" = transport_orders.id \
            left join ships as ships \
            ON dispositions."shipId" = ships.id\
            left join warehouses as warehouses \
            ON dispositions."warehouseId" = warehouses.id\
            left join vendor_and_customers as vendor_and_customers\
            ON dispositions."forwarderId" = vendor_and_customers.id\
            left join scales as scales\
            ON dispositions."scaleId" = scales.id\
            left join weighing_stations as weighing_stations\
            ON dispositions."weighingStationId" = weighing_stations.id\
            left join users as users\
            ON dispositions."authorId" = users.id \
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

  rowFilter = 'dispositions.date BETWEEN :startDate AND :finishDate'
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
      date: rec.date ? moment(rec.date).format('DD.MM.YYYY HH:mm:ss') : '',
      number: rec.number,
      numberOfWeighings: rec.numberOfWeighings,
      numberOfWeighted: rec.numberOfWeighted,
      type: rec.type,
    }

    newRec.vehicle = {
      id: rec.vehicle_id,
      name: rec.vehicle_name,
    }

    newRec.schemeOfCargo = {
      id: rec.scheme_of_cargo_id,
      name: rec.scheme_of_cargo_name,
    }

    newRec.product = {
      id: rec.product_id,
      name: rec.product_name,
    }

    newRec.order = {
      id: rec.order_id,
      name: rec.order_number,
    }

    newRec.ship = {
      id: rec.ship_id,
      name: rec.ship_number,
    }

    newRec.warehouse = {
      id: rec.warehouse_id,
      name: rec.warehouse_name,
    }

    newRec.forwarder = {
      id: rec.forwarder_id,
      name: rec.forwarder_name,
    }

    newRec.scale = {
      id: rec.scale_id,
      name: rec.scale_name,
    }

    newRec.weighing_station = {
      id: rec.weighing_station_id,
      name: rec.weighing_station_name,
    }

    newRec.vendor = {
      id: rec.vendor_id,
      name: rec.vendor_name,
    }

    newRec.author = {
      id: rec.author_id,
      name: rec.author_name,
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
