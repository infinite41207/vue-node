'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_order_statuses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      default: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      customerAccess: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      customerLockOrder: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isClosed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
      },
      markedToDelete: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('sales_order_statuses', { transaction: t })]);
    });
  },
};
