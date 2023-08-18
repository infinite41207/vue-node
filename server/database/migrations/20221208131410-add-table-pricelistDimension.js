'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricelist_dimensions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      dimensionUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      min: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      max: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      step: {
        type: Sequelize.DataTypes.INTEGER,
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
      dimensionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'product_params',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('pricelist_dimensions', { transaction: t })]);
    });
  },
};
