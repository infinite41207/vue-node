'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricelists', {
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
      priceCode: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING(250),
      },
      pricelistKind: {
        type: Sequelize.DataTypes.ENUM,
        values: ['main', 'surcharge'],
        allowNull: false,
        index: true,
      },
      includedInMain: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notUseDiscount: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      beginDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
      },
      pricingMethod: {
        type: Sequelize.DataTypes.ENUM,
        values: ['table', 'scale', 'fixed', 'formula', 'percent'],
        allowNull: false,
      },
      priceType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      maxDiscount: {
        type: Sequelize.DataTypes.DECIMAL(7, 2),
        allowNull: false,
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      region: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      currency: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
      },
      filters: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      filtersDescription: {
        type: Sequelize.DataTypes.TEXT,
      },
      priceFormula: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
      },
      priceFormulaDescription: {
        type: Sequelize.DataTypes.STRING,
      },
      confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      lang: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('pricelists', { transaction: t })]);
    });
  },
};
