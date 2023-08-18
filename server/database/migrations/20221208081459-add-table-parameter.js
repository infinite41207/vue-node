'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_params', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      productUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
      },
      serialNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      dataType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      nextParamUuid: {
        type: Sequelize.DataTypes.STRING(36),
      },
      minValue: {
        type: Sequelize.DataTypes.STRING,
      },
      maxValue: {
        type: Sequelize.DataTypes.STRING,
      },
      codeName: {
        type: Sequelize.DataTypes.STRING(100),
      },
      filterDefault: {
        type: Sequelize.DataTypes.STRING(2000),
      },
      filter: {
        type: Sequelize.DataTypes.STRING(2000),
      },
      confirmDefault: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasProperties: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasExpression: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasDepended: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasRequared: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasConfirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasInformation: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      return Promise.all([queryInterface.dropTable('product_params', { transaction: t })]);
    });
  },
};
