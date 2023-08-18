'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('scales', 'barCodePrefix', { type: Sequelize.DataTypes.STRING(10) })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('scales', 'barCodePrefix', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
