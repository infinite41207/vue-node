'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('navigations', 'paramValues', { type: Sequelize.DataTypes.STRING })
      await queryInterface.addColumn('navigations', 'qeryParam', { type: Sequelize.DataTypes.STRING })
      await queryInterface.addColumn('navigations', 'hashParam', { type: Sequelize.DataTypes.STRING })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('navigations', 'paramValues', { transaction })
      await queryInterface.removeColumn('navigations', 'qeryParam', { transaction })
      await queryInterface.removeColumn('navigations', 'hashParam', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
