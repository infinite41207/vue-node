'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doc_numerators', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      docType: {
        type: Sequelize.DataTypes.INTEGER,
      },
      numerator: {
        type: Sequelize.DataTypes.INTEGER,
      },
      numeratorValue: {
        type: Sequelize.DataTypes.STRING,
      },
      yearNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      lastNumber: {
        type: Sequelize.DataTypes.INTEGER,
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
      return Promise.all([queryInterface.dropTable('doc_numerators', { transaction: t })]);
    });
  },
};
