const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const User = require('@catalogs/users/models')
const Enums = require('@enums')

class Calendar extends Model {}

Calendar.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.CALENDAR_TYPE,
      allowNull: false,
      defaultValue: 'private',
    },
    attendees: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      references: { model: 'users', key: 'id' },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Calendar',
    tableName: 'calendars',
  }
)

Calendar.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
})

module.exports = Calendar
