const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require('@enums')

class WeighingStation extends Model {}

WeighingStation.init(
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
      type: DataTypes.STRING(9),
    },
    typeOfDocument: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DOCUMENT,
      allowNull: false,
    },
    scalesType: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_SCALE,
      allowNull: false,
    },
    barCodePrefix: {
      type: DataTypes.STRING(10),
    },
    automaticWeightingEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
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
    modelName: 'WeighingStation',
    tableName: 'weighing_stations',
    mainModel: true,
  }
)

module.exports = WeighingStation
