'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('event_statuses', 'description', 'name')
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn('event_statuses', 'name', 'description')
  },
}
