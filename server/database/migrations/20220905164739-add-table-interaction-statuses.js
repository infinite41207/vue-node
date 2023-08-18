'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('interaction_statuses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
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
      code: {
        type: Sequelize.DataTypes.STRING(20),
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
      },
      color: {
        type: Sequelize.DataTypes.STRING(50),
      },
      isClosed: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      predefinedName: {
        type: Sequelize.DataTypes.STRING(50),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('interaction_statuses', { transaction: t })]);
    });
  },
};
