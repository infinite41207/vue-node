const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class CustomerRequestStatus extends Model {}

CustomerRequestStatus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
    },
    predefinedName: {
      type: DataTypes.STRING(50),
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
    modelName: 'CustomerRequestStatus',
    tableName: 'customer_request_statuses',
    mainModel: true,
  }
)

module.exports = CustomerRequestStatus
