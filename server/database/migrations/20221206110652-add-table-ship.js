'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ships', {
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
        type: Sequelize.DataTypes.STRING(9),
      },
      comment: {
        type: Sequelize.DataTypes.STRING(20),
      },
      imo: {
        type: Sequelize.DataTypes.STRING(7),
      },
      length: {
        type: Sequelize.DataTypes.INTEGER,
      },
      number: {
        type: Sequelize.DataTypes.STRING(10),
      },
      width: {
        type: Sequelize.DataTypes.INTEGER,
      },
      externalId: {
        type: Sequelize.DataTypes.STRING(10),
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
      return Promise.all([queryInterface.dropTable('ships', { transaction: t })]);
    });
  },
};
