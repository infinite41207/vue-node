'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_view_settings', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(250),
        allowNull: false,
        index: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      template: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      module: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      style: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      viewId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'view_settings',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('user_view_settings', { transaction: t })])
    })
  },
}
