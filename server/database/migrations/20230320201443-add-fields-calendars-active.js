'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.addColumn('calendars', 'active', { type: Sequelize.DataTypes.BOOLEAN, defaultValue: true }, { transaction: t })])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('calendars', 'active', { type: Sequelize.DataTypes.BOOLEAN, defaultValue: true }, { transaction: t })])
    })
  },
}
