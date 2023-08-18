'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exchange_objects', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      objectId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      objectName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      objectDescription: {
        type: Sequelize.DataTypes.STRING,
      },
      changeType: {
        type: Sequelize.DataTypes.INTEGER, // 0-create; 1-update; 2-marked to delete / restore; 3 - delete
        allowNull: false,
        index: true,
      },
      sent: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('exchange_objects', { transaction: t })]);
    });
  },
};
