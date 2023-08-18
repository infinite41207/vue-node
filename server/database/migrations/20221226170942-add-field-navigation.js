'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('navigations', 'viewId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('navigations', {
        fields: ['viewId'],
        type: 'FOREIGN KEY',
        name: 'navigations_viewId_fkey',
        references: {
          table: 'view_settings',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('navigations', 'navigations_viewId_fkey', { transaction })
      await queryInterface.removeColumn('navigations', 'viewId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
