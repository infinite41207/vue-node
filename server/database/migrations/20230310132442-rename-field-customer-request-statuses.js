'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('customer_request_statuses', 'description', 'name', { transaction: t }),
        queryInterface.renameColumn('customer_request_statuses', 'code1C', 'code', { transaction: t }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('customer_request_statuses', 'name', 'description', { transaction: t }),
      queryInterface.renameColumn('customer_request_statuses', 'code', 'code1C', { transaction: t }),
    ])
  },
}
