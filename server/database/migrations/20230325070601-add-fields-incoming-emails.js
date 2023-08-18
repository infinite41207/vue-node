'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn('incoming_emails', 'hash', { type: Sequelize.DataTypes.STRING(32) }, { transaction: t })
    })
  },

  async down(queryInterface, Sequelize) {},
}
