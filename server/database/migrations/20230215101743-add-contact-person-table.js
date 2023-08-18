'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contact_persons', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING(100),
      },
      phone: {
        type: Sequelize.DataTypes.STRING(12),
      },
      address: {
        type: Sequelize.DataTypes.STRING(50),
      },
      birthDate: {
        type: Sequelize.DataTypes.DATE,
      },
      sex: {
        type: Sequelize.DataTypes.STRING(20),
      },
      role: {
        type: Sequelize.DataTypes.STRING(50),
      },
      notActive: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      comment: {
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      vendorId: {
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
      positionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'positions',
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
      return Promise.all([queryInterface.dropTable('contact_persons', { transaction: t })])
    })
  },
}
