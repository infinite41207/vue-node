'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('crm_events', 'description', 'name')
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn('crm_events', 'name', 'description')
  },
}
