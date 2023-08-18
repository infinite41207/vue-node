'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('depend_prop_dimensions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      propUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      dimension: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      dimensionType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      min: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      step: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
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
      paramPropId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'param_props',
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
      return Promise.all([queryInterface.dropTable('depend_prop_dimensions', { transaction: t })]);
    });
  },
};
