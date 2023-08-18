'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discounts', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.STRING(9),
        allowNull: false,
      },
      priority: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      beginDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
      },
      belonging: {
        type: Sequelize.DataTypes.ENUM,
        values: ['main', 'surcharge', 'main_and_surcharge', 'surcharge_and_price', 'all'],
        allowNull: false,
      },
      priceCode: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      priceType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      discountType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['price', 'percent', 'formula'],
        allowNull: false,
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      priceFormula: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
      },
      priceFormulaDescription: {
        type: Sequelize.DataTypes.STRING,
      },
      includeMain: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      priceDiscount: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      filters: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      filtersDescription: {
        type: Sequelize.DataTypes.TEXT,
      },
      confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      pricelistId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'pricelists',
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('discounts', { transaction: t })])
    })
  },
}
