'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendar_events', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
      },
      start: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      end: {
        type: Sequelize.DataTypes.DATE,
      },
      allDay: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      eventId: {
        type: Sequelize.DataTypes.UUID,
      },
      eventType: {
        type: Sequelize.DataTypes.STRING,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('calendar_events', { transaction: t })])
    })
  },
}
