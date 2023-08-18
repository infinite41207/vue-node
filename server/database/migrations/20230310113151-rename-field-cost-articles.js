'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('cost_articles', 'description', 'name')
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn('cost_articles', 'name', 'description')
  },
}
