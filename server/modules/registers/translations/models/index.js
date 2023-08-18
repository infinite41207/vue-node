const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Translation extends Model {}

Translation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    catalogType: {
      type: DataTypes.ENUM,
      values: ['product', 'parameter', 'parameter_value', 'property', 'property_value', 'pricelist'],
      allowNull: false,
      index: true,
    },
    catalogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    lang: {
      type: DataTypes.STRING(10),
      allowNull: false,
      index: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Translation',
    tableName: 'translations',
    mainModel: true,
  }
)

module.exports = Translation
