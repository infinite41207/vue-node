'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bp_definitions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      stages: {
        type: Sequelize.DataTypes.TEXT,
      },
      stageSettingsList: {
        type: Sequelize.DataTypes.TEXT,
      },
      onExecution: {
        type: Sequelize.DataTypes.TEXT,
      },
      ownerObject: {
        type: Sequelize.DataTypes.TEXT,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
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
      return Promise.all([queryInterface.dropTable('bp_definitions', { transaction: t })]);
    });
  },
};
