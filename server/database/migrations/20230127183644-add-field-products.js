'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('products', 'markedToDelete', { type: Sequelize.DataTypes.BOOLEAN })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('products', 'markedToDelete', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}