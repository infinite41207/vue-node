const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Event = require('@catalogs/events/models')

class EventContacts extends Model {}

EventContacts.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'EventContacts',
    tableName: 'event_contacts',
    mainModel: true,
  }
)

Event.hasMany(EventContacts, {
  foreignKey: 'eventId',
  as: 'event_contacts',
  onDelete: 'cascade',
  hooks: true,
})

EventContacts.belongsTo(VendorAndCustomer, {
  foreignKey: 'vendorId',
  onDelete: 'cascade',
})

module.exports = EventContacts
