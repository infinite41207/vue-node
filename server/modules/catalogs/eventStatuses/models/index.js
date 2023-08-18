const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class EventStatus extends Model {}

EventStatus.init(
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
    modelName: 'EventStatus',
    tableName: 'event_statuses',
    mainModel: true,
  }
)

module.exports = EventStatus
