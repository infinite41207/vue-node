const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Driver extends Model {}

Driver.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(12),
    },
    idCard: {
      type: DataTypes.STRING(25),
    },
    termsOfUse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    phone: {
      type: DataTypes.STRING(25),
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
    modelName: 'Driver',
    tableName: 'drivers',
    mainModel: true,
  }
)

module.exports = Driver
