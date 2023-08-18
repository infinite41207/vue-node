const ProductParamSettings = require('@registers/productParameterSettings/models')
const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')
const Parameter = require('@catalogs/constructor/models/parameter')
const ParamProperty = require('@catalogs/constructor/models/parameterProperty')
const PropertyValue = require('@catalogs/constructor/models/propertyValue')
const ParamValue = require('@catalogs/constructor/models/parameterValue')

const exchangeERP = require('./exchangeERP')
const moment = require('moment')

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync product parameter settings')

  await exchangeERP
    .getProductParamSettings()
    .then(async (response) => {
      if (!response.data) {
        return
      }

      await ProductParamSettings.destroy({
        where: {},
        truncate: true,
      })

      for (let settingsRow of response.data) {
        //set product id
        const product = await Product.findOne({
          where: { uuid: settingsRow.productUuid },
        })

        if (product) {
          settingsRow.productId = product.id
        }

        //set customer id
        if (settingsRow.customerUuid !== '') {
          const customer = await Customer.findOne({
            where: { uuid: settingsRow.customerUuid },
          })

          if (customer) {
            settingsRow.customerId = customer.id
          }
        }

        //set parameter id
        if (settingsRow.parameterUuid !== '') {
          const parameter = await Parameter.findOne({
            where: { uuid: settingsRow.parameterUuid },
          })

          if (parameter) {
            settingsRow.parameterId = parameter.id
          }
        }

        //set parameter property id
        if (settingsRow.parameterPropertyUuid !== '') {
          const paramProperty = await ParamProperty.findOne({
            where: { uuid: settingsRow.parameterPropertyUuid },
          })

          if (paramProperty) {
            settingsRow.parameterPropertyId = paramProperty.id
          }
        }

        //set parameter value id
        if (settingsRow.parameterValueUuid !== '') {
          const paramValue = await ParamValue.findOne({
            where: { uuid: settingsRow.parameterValueUuid },
          })

          if (paramValue) {
            settingsRow.parameterValueId = paramValue.id
          }
        }

        //set property value id
        if (settingsRow.propertyValdueUuid !== '') {
          const propertyValue = await PropertyValue.findOne({
            where: { uuid: settingsRow.propertyValdueUuid },
          })

          if (propertyValue) {
            settingsRow.propertyValueId = propertyValue.id
          }
        }

        await ProductParamSettings.create({ ...settingsRow })
      }
    })
    .catch((err) => {
      console.log(err)
    })

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync product parameter settings')
}
