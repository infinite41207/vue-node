'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('role_group_settings', 'userRoleId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('role_group_settings', {
        fields: ['userRoleId'],
        type: 'FOREIGN KEY',
        name: 'role_group_settings_userRoleId_fkey',
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
      await queryInterface.removeConstraint('role_group_settings', 'role_group_settings_userRoleId_fkey', { transaction })
      await queryInterface.removeColumn('role_group_settings', 'userRoleId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
