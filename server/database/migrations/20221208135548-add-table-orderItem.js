'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      configProduct: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      reference: {
        type: Sequelize.DataTypes.STRING(150),
      },
      unitOfMeasureStr: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      vat: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      sumBrutto: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      sumNetto: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      discountPercent: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      discountSum: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      numberOfPieces: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      length: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      height: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      colour: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      choosenParameters: {
        type: Sequelize.DataTypes.TEXT,
      },
      incompliteParams: {
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
      unitOfMeasureId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'unit_of_measures',
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
            tableName: 'orders',
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
      return Promise.all([queryInterface.dropTable('order_items', { transaction: t })]);
    });
  },
};
