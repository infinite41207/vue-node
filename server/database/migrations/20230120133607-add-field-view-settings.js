'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('view_settings', 'markedToDelete', { type: Sequelize.DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('view_settings', 'markedToDelete', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
