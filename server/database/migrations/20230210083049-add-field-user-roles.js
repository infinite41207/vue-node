'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('user_roles', 'readOnly', { type: Sequelize.DataTypes.BOOLEAN })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('user_roles', 'readOnly', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
