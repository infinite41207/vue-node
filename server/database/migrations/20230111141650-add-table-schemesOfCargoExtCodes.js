'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schemes_of_cargo_external_codes', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      externalCode: {
        type: Sequelize.DataTypes.STRING(20),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      schemeOfCargoId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'schemes_of_cargo',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('schemes_of_cargo_external_codes', { transaction: t })]);
    });
  },
};
