'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_prices', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      priceType: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
      },
      priceCode: {
        type: Sequelize.DataTypes.STRING(50),
      },
      priceDescription: {
        type: Sequelize.DataTypes.STRING(100),
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      sum: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      discountPercent: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      discountSum: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
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
      orderItemId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'order_items',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      discountId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'discounts',
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
      return Promise.all([queryInterface.dropTable('order_prices', { transaction: t })]);
    });
  },
};
