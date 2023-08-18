'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_and_customers', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(9),
      },
      isCustomer: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      isVendor: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      isForwarder: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      notUse: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      numberOfCopies: {
        type: Sequelize.DataTypes.DECIMAL(10, 0),
      },
      fullName: {
        type: Sequelize.DataTypes.STRING(250),
      },
      useActualWarehouse: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      sendDriversSms: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      useProductCondition: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
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
      return Promise.all([queryInterface.dropTable('vendor_and_customers', { transaction: t })]);
    });
  },
};
