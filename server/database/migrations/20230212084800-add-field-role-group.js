'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('role_groups', 'markedToDelete', { type: Sequelize.DataTypes.BOOLEAN })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('role_groups', 'markedToDelete', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
