'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('interactions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      version: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      versionUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
        index: true,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      state: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Active', 'Deactive'],
        allowNull: false,
        defaultValue: 'Active',
        index: true,
      },
      numberStr: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      prefix: {
        type: Sequelize.DataTypes.STRING(4),
        allowNull: false,
        index: true,
      },
      reference: {
        type: Sequelize.DataTypes.STRING(150),
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      ordered: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      executionTerm: {
        type: Sequelize.DataTypes.DATE,
      },
      tags: {
        type: Sequelize.DataTypes.STRING,
      },
      comment: {
        type: Sequelize.DataTypes.STRING,
      },
      authorId: {
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
      managerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'employees',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      customerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'counterparties',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      statusId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'interaction_statuses',
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
      return Promise.all([queryInterface.dropTable('interactions', { transaction: t })])
    })
  },
}
