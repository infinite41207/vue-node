'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('currencies', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(3),
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
      },
      fullName: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      symbol: {
        type: Sequelize.DataTypes.STRING(3),
        allowNull: false,
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
      return Promise.all([queryInterface.dropTable('currencies', { transaction: t })]);
    });
  },
};
