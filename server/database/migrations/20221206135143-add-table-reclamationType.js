'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_types', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      days: {
        type: Sequelize.DataTypes.INTEGER,
      },
      oracleId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      printName: {
        type: Sequelize.DataTypes.STRING,
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
      return Promise.all([queryInterface.dropTable('reclamation_types', { transaction: t })]);
    });
  },
};
