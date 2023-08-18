'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doc_prefixes', {
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
      name: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
      },
      template: {
        type: Sequelize.DataTypes.STRING,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('doc_prefixes', { transaction: t })]);
    });
  },
};
