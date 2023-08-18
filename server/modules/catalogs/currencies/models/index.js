const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Currency extends Model {}

Currency.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Currency',
    tableName: 'currencies',
    mainModel: true,
  }
)

module.exports = Currency
