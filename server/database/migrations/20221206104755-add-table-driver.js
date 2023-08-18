'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(25),
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(12),
      },
      idCard: {
        type: Sequelize.DataTypes.STRING(25),
      },
      termsOfUse: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(25),
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
      return Promise.all([queryInterface.dropTable('drivers', { transaction: t })]);
    });
  },
};
