const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ExchangeObject extends Model {}

ExchangeObject.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    objectId: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    objectName: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    objectDescription: {
      type: DataTypes.STRING,
    },
    changeType: {
      type: DataTypes.INTEGER, // 0-create; 1-update; 2-marked to delete / restore; 3 - delete
      allowNull: false,
      index: true,
    },
    sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ExchangeObject',
    tableName: 'exchange_objects',
    mainModel: true,
  }
)

module.exports = ExchangeObject
