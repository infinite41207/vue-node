'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // queryInterface.removeColumn('calendar_events', 'isPrivate', { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
        // queryInterface.removeColumn('calendar_events', 'creator', { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        // queryInterface.removeColumn('calendar_events', 'attendees', { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
        // queryInterface.removeColumn('calendar_events', 'eventId', { type: Sequelize.DataTypes.UUID }, { transaction: t }),
        queryInterface.addColumn(
          'calendar_events',
          'ownerId',
          {
            type: Sequelize.DataTypes.UUID,
            references: {
              model: {
                tableName: 'users',
              },
              key: 'id',
            },
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'calendar_events',
          'calendarId',
          {
            type: Sequelize.DataTypes.UUID,
            references: {
              model: {
                tableName: 'calendars',
              },
              key: 'id',
            },
          },
          { transaction: t }
        ),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('calendar_events', 'ownerId', { type: Sequelize.DataTypes.UUID }, { transaction: t }),
        queryInterface.removeColumn('calendar_events', 'calendarId', { type: Sequelize.DataTypes.UUID }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'isPrivate', { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'creator', { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'attendees', { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'eventId', { type: Sequelize.DataTypes.UUID }, { transaction: t }),
      ])
    })
  },
}
