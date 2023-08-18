'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('navigations', 'accessRoleId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('navigations', {
        fields: ['accessRoleId'],
        type: 'FOREIGN KEY',
        name: 'navigations_accessRoleId_fkey',
        references: {
          table: 'user_roles',
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
      await queryInterface.removeConstraint('navigations', 'navigations_accessRoleId_fkey', { transaction })
      await queryInterface.removeColumn('navigations', 'accessRoleId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
