const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Driver = require('@catalogs/drivers/models')
const Forwarder = require('@catalogs/vendorsAndCustomers/models')

class DriverForwarder extends Model {}

DriverForwarder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'DriverForwarder',
    tableName: 'driver_forwarders',
  }
)

Driver.hasMany(DriverForwarder, {
  foreignKey: 'parentId',
  as: 'forwarders',
  onDelete: 'CASCADE',
  hooks: true,
})

DriverForwarder.belongsTo(Driver, {
  foreignKey: 'parentId',
  as: 'driver',
  onDelete: 'CASCADE',
})

DriverForwarder.belongsTo(Forwarder, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})

module.exports = DriverForwarder
