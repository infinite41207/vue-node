const Customer = require('@catalogs/counterparties/models')
const Country = require('@catalogs/countries/models')
const Parameter = require('../models/parameter')
const ParameterValue = require('../models/parameterValue')
const ValueProperty = require('../models/valueProperty')
const ParameterProperty = require('../models/parameterProperty')
const PropertyValue = require('../models/propertyValue')
const ConstructorService = require('@services/constructorService')
const { Op, Sequelize } = require('sequelize')

module.exports = {
  async findAll(req, res, next) {
    const { paramId, customerId, productId, hasDepended, hasExpression, lang } = req.body

    const currentParameter = await Parameter.findOne({
      where: { id: paramId },
    })

    if (!currentParameter) {
      res.status(400).send([])
      return
    }

    const needTranslate = lang && lang !== 'pl'

    let query = {
      where: { paramId },
      attributes: {
        exclude: ['sortNumber', 'rowUuid', 'paramUuid', 'paramId'],
      },
      order: ['sortNumber'],
      include: [
        {
          model: ValueProperty,
          as: 'properties',
          attributes: ['id', 'propId', 'propValue', 'propValueUuid', 'fillingRequires', 'checkList'],
          order: ['sort_number'],
          include: [
            {
              model: ParameterProperty,
              as: 'property',
              attributes: {
                exclude: ['id', 'productUuid', 'paramId', 'paramUuid', 'fillFrom'],
              },
              include: [
                {
                  model: PropertyValue,
                  as: 'values',
                  attributes: ['name', 'uuid', 'lang'],
                },
              ],
            },
          ],
        },
      ],
    }

    let paramValues = await ParameterValue.findAll(query)

    paramValues = JSON.stringify(paramValues)
    paramValues = JSON.parse(paramValues)

    if (needTranslate === true) {
      await ConstructorService.localizeParamValues(paramValues, lang)
    }

    const customer = await Customer.findByPk(customerId, { include: [{ model: Country, attributes: ['id', 'name', 'uuid'], as: 'country' }] })

    if (!customer) {
      res.status(400).send([])
      return
    }

    if (paramValues) {
      await ConstructorService.convertDataTypes(paramValues)

      let collectParameters = await ConstructorService.getCollectParameters([], customer)

      if (hasDepended) {
        await ConstructorService.calculateDependedValues(paramValues, collectParameters)
      }

      if (hasExpression) {
        await ConstructorService.calculateExpressionVariables(productId, paramValues, collectParameters)
      }

      const filteredValues = await ConstructorService.filterParamValues(currentParameter, paramValues, collectParameters)

      if (filteredValues) {
        //sort properties
        for (let value of filteredValues) {
          let corrSort = false
          for (let propertyValue of value.properties) {
            if (propertyValue.property.confirmed || propertyValue.property.fillingRequires) {
              propertyValue.sortNumber -= 100
              corrSort = true
            }
          }

          if (corrSort) {
            value.properties.sort((a, b) => {
              return a.sortNumber - b.sortNumber
            })
          }
        }

        res.status(200).send(filteredValues)
      } else {
        res.status(200).send([])
      }
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    const currentValue = await ParameterValue.findByPk(req.params.id)

    if (currentValue) {
      res.status(200).send(currentValue)
    } else {
      res.status(400).send({ message: 'Param value not find' })
    }
  },

  async findNextValues(req, res, next) {
    const { customerId, productId, nextParam, choosenParameters, lang } = req.body

    const nextParameter = await Parameter.findOne({
      where: { id: nextParam.id },
    })

    const needTranslate = lang && lang !== 'pl'

    if (nextParameter) {
      let paramValues = await ParameterValue.findAll({
        where: { paramId: nextParam.id },
        include: [
          {
            model: ValueProperty,
            as: 'properties',
            attributes: ['id', 'propId', 'propValue', 'propValueUuid', 'fillingRequires', 'checkList', 'sortNumber'],
            order: ['sortNumber'],
            include: [
              {
                model: ParameterProperty,
                attributes: ['name', 'uuid', 'codeName', 'dataType', 'expression', 'fillingRequires', 'fillFrom', 'confirmed', 'depended', 'information', 'lang'],
                as: 'property',
                include: [
                  {
                    model: PropertyValue,
                    as: 'values',
                    attributes: ['name', 'uuid', 'lang'],
                    order: [['name', 'ASC']],
                  },
                ],
              },
            ],
          },
        ],
        order: [['sortNumber', 'ASC']],
      })

      paramValues = JSON.stringify(paramValues)
      paramValues = JSON.parse(paramValues)

      if (needTranslate === true) {
        await ConstructorService.localizeParamValues(paramValues, lang)
      }

      const customer = await Customer.findByPk(customerId, { include: [{ model: Country, attributes: ['id', 'name', 'uuid'], as: 'country' }] })

      if (!customer) {
        res.status(400).send([])
        return
      }

      await ConstructorService.convertDataTypes(paramValues)

      let collectParameters = await ConstructorService.getCollectParameters(choosenParameters, customer)

      if (nextParam.hasDepended) {
        await ConstructorService.calculateDependedValues(paramValues, collectParameters)
      }

      if (nextParam.hasExpression) {
        await ConstructorService.calculateExpressionVariables(productId, paramValues, collectParameters)
      }

      if (paramValues && paramValues.length > 0) {
        const filteredValues = await ConstructorService.filterParamValues(nextParameter, paramValues, collectParameters)

        if (filteredValues) {
          //sort properties
          for (let value of filteredValues) {
            let corrSort = false
            for (let propertyValue of value.properties) {
              if (propertyValue.property.confirmed || propertyValue.property.fillingRequires) {
                propertyValue.sortNumber -= 100
                corrSort = true
              }
            }

            if (corrSort) {
              value.properties.sort((a, b) => {
                return a.sortNumber - b.sortNumber
              })
            }
          }

          res.status(200).send({ values: filteredValues })
        } else {
          res.status(200).send({ values: [] })
        }
      } else {
        res.status(200).send({ values: [] })
      }
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findSelected(req, res, next) {
    const { valuesId, lang } = req.body

    const needTranslate = lang && lang !== 'pl'

    let paramValues = await ParameterValue.findAll({
      where: { id: { [Op.in]: valuesId } },
      attributes: ['id', 'name', 'nextParamUuid', 'uuid', 'state', 'hidden', 'descr', 'messageDescr', 'strNumber', 'lang'],
      order: ['sortNumber'],
      include: [
        {
          model: ValueProperty,
          as: 'properties',
          attributes: ['id', 'propId', 'propValue', 'propValueUuid', 'fillingRequires', 'checkList'],
          order: ['sort_number'],
          include: [
            {
              model: ParameterProperty,
              as: 'property',
              attributes: ['name', 'uuid', 'codeName', 'dataType', 'expression', 'fillingRequires', 'fillFrom', 'confirmed', 'depended', 'information', 'lang'],
              include: [
                {
                  model: PropertyValue,
                  as: 'values',
                  attributes: ['name', 'uuid', 'lang'],
                },
              ],
            },
          ],
        },
      ],
    })

    if (paramValues) {
      paramValues = JSON.stringify(paramValues)
      paramValues = JSON.parse(paramValues)

      if (needTranslate === true) {
        await ConstructorService.localizeParamValues(paramValues, lang)
      }
      res.status(200).send(paramValues)
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },
}
