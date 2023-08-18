'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('department_employees', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      employeeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      },
      parentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'departments',
          },
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('department_employees', { transaction: t })])
    })
  },
}
