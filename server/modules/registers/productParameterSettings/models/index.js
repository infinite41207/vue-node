const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const Product = require('@catalogs/products/models')
const Parameter = require('@catalogs/constructor/models/parameter')
const ParameterProperty = require('@catalogs/constructor/models/parameterProperty')
const ParameterValue = require('@catalogs/constructor/models/parameterValue')
const PropertyValue = require('@catalogs/constructor/models/propertyValue')

class ProductParameterSetting extends Model {}

ProductParameterSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    customerParam: {
      type: DataTypes.STRING(100),
    },
    customerValueParam: {
      type: DataTypes.STRING(100),
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    programCode: {
      type: DataTypes.TEXT,
    },
    paramCalcFactor: {
      type: DataTypes.INTEGER,
    },
    propertyCalcFactor: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'ProductParameterSetting',
    tableName: 'product_parameter_settings',
    mainModel: true,
  }
)

ProductParameterSetting.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

ProductParameterSetting.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

ProductParameterSetting.belongsTo(Parameter, {
  foreignKey: 'parameterId',
  as: 'parameter',
})

ProductParameterSetting.belongsTo(ParameterProperty, {
  foreignKey: 'parameterPropertyId',
  as: 'parameterProperty',
})

ProductParameterSetting.belongsTo(ParameterValue, {
  foreignKey: 'parameterValueId',
  as: 'parameterValue',
})

ProductParameterSetting.belongsTo(PropertyValue, {
  foreignKey: 'propertyValueId',
  as: 'propertyValue',
})

module.exports = ProductParameterSetting
