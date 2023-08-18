'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('event_names', 'description', 'name')
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn('event_names', 'name', 'description')
  },
}
