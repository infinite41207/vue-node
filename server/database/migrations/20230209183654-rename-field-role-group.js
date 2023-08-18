'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.renameColumn('role_groups', 'description', 'name', { transaction: t })])
    })
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('role_groups', 'name', 'description', { transaction: t })])
  },
}
