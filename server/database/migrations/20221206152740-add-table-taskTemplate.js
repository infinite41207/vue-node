'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_templates', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      importance: {
        type: Sequelize.DataTypes.ENUM,
        values: ['HIGHT', 'NORMAL', 'LOW', 'NOT_SET'],
        allowNull: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(9),
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      executionDays: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      executionHours: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      executionMinutes: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      currentDateExecution: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      сheckExecution: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      executorId: {
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
      executorRoleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'executor_roles',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      checkerId: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('task_templates', { transaction: t })]);
    });
  },
};
