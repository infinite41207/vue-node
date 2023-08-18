const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');
const User = require('@catalogs/users/models');
const Calendar = require('@registers/calendars/models');

class CalendarEvent extends Model { }

CalendarEvent.init(
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
    start: {
      type: DataTypes.DATE,
    },
    end: {
      type: DataTypes.DATE,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    notes: {
      type: DataTypes.STRING,
    },
    allDay: {
      type: DataTypes.BOOLEAN,
    },
    attendees: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      references: { model: 'users', key: 'id' },
    },
    parentType: {
      type: DataTypes.STRING,
    },
    parentId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'CalendarEvent',
    tableName: 'calendar_events',
  }
);

CalendarEvent.belongsTo(Calendar, {
  foreignKey: 'calendarId',
  as: 'calendar',
});

CalendarEvent.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

module.exports = CalendarEvent;
