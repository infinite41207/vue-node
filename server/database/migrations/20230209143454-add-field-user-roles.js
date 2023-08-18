'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('user_roles', 'parentId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('user_roles', {
        fields: ['parentId'],
        type: 'FOREIGN KEY',
        name: 'user_roles_parentId_fkey',
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
      await queryInterface.removeConstraint('user_roles', 'user_roles_parentId_fkey', { transaction })
      await queryInterface.removeColumn('user_roles', 'parentId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
