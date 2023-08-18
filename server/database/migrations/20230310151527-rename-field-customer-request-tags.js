'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.renameColumn('customer_request_tags', 'description', 'name', { transaction: t })])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.renameColumn('customer_request_tags', 'name', 'description', { transaction: t })])
    })
  },
}
