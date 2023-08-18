'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('translations', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      catalogType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['product', 'parameter', 'parameter_value', 'property', 'property_value', 'pricelist'],
        allowNull: false,
        index: true,
      },
      catalogId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      lang: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
        index: true,
      },
      description: {
        type: Sequelize.DataTypes.STRING(100),
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('translations', { transaction: t })]);
    });
  },
};
