'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.addColumn('calendars', 'attendees', { type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.UUID) }, { transaction: t })])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('calendars', 'attendees', { type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.UUID) }, { transaction: t })])
    })
  },
}
