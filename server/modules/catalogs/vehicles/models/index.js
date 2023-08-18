const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require('@enums')

const TrackModel = require('@catalogs/trackModels/models')
const Carrier = require('@catalogs/carriers/models')

class Vehicle extends Model {}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(12),
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.TRANSPORT_TYPE,
      allowNull: false,
    },
    tare: {
      type: DataTypes.DECIMAL(15, 3),
    },
    loadCapacity: {
      type: DataTypes.DECIMAL(15, 3),
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
    modelName: 'Vehicle',
    tableName: 'vehicles',
    mainModel: true,
  }
)

Vehicle.belongsTo(TrackModel, {
  foreignKey: 'trackModelId',
  as: 'trackModel',
})
Vehicle.belongsTo(Carrier, {
  foreignKey: 'carrierId',
  as: 'carrier',
})

module.exports = Vehicle
