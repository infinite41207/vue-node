const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const EventTypes = require('@catalogs/eventTypes/models')
const EventStatuses = require('@catalogs/eventStatuses/models')
const Counterparties = require('@catalogs/counterparties/models')
const Projects = require('@catalogs/projects/models')
const Users = require('@catalogs/users/models')
const Interactions = require('@documents/interactions/models')
const Employee = require('@catalogs/employees/models')

class Event extends Model {}
Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parentType: {
      type: DataTypes.STRING(50),
    },
    parentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },    
    date: {
      type: DataTypes.DATE,
    },
    begin: {
      type: DataTypes.DATE,
    },
    ending: {
      type: DataTypes.DATE,
    },
    contact: {
      type: DataTypes.TEXT,
    },
    howToContact: {
      type: DataTypes.TEXT,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Event',
    tableName: 'crm_events',
    mainModel: true,
  }
)

Event.belongsTo(Counterparties, {
  foreignKey: 'counterpartyId',
  as: 'counterparty',
})

Event.belongsTo(Projects, {
  foreignKey: 'projectId',
  as: 'project',
})

Event.belongsTo(Users, {
  foreignKey: 'authorId',
  as: 'author',
})

Event.belongsTo(Interactions, {
  foreignKey: 'interactionId',
  as: 'interaction',
})

Event.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee',
})

Event.belongsTo(EventTypes, {
  foreignKey: 'eventTypeId',
  as: 'eventType',
})

Event.belongsTo(EventStatuses, {
  foreignKey: 'eventStatusId',
  as: 'eventStatus',
})

module.exports = Event
