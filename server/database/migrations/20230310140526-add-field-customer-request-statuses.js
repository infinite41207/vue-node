'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('customer_request_statuses', 'markedToDelete', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('customer_request_statuses', 'markedToDelete', { transaction: t })])
    })
  },
}
