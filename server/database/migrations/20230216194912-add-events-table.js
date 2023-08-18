'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crm_events', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      begin: {
        type: Sequelize.DataTypes.DATE,
      },
      ending: {
        type: Sequelize.DataTypes.DATE,
      },
      contact: {
        type: Sequelize.DataTypes.TEXT,
      },
      howToContact: {
        type: Sequelize.DataTypes.TEXT,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
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
      counterpartyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'vendor_and_customers',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'projects',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      interactionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'interactions',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      employeeId: {
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('crm_events', { transaction: t })])
    })
  },
}
