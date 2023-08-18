'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@enums': `${__dirname}/../../modules/enums`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('register_inventory', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      registratorId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      registratorType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      typeOfOperation: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_OPERATION,
        allowNull: false,
      },
      count: {
        type: Sequelize.DataTypes.DECIMAL(15, 4),
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
      productId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      ownerId: {
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
      warehouseId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'warehouses',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      boxId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'boxes',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      forwarderId: {
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
      orderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'transport_orders',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      expenseOrderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'transport_orders',
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
      return Promise.all([queryInterface.dropTable('register_inventory', { transaction: t })])
    })
  },
}
