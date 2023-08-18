'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('calendar_events', 'date', { type: Sequelize.DataTypes.DATEONLY }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'notes', { type: Sequelize.DataTypes.STRING }, { transaction: t }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('calendar_events', 'date', { type: Sequelize.DataTypes.DATEONLY }, { transaction: t }),
        queryInterface.addColumn('calendar_events', 'notes', { type: Sequelize.DataTypes.STRING }, { transaction: t }),
      ])
    })
  },
}
