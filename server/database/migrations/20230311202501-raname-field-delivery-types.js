'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.renameColumn('delivery_types', 'description', 'name', { transaction: t })])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.renameColumn('delivery_types', 'description', 'name', { transaction: t })])
    })
  },
}
