const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class SalesOrderStatus extends Model {}

SalesOrderStatus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      _fullSearch: true,
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerLockOrder: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'SalesOrderStatus',
    tableName: 'sales_order_statuses',
    mainModel: true,
  }
)

module.exports = SalesOrderStatus
