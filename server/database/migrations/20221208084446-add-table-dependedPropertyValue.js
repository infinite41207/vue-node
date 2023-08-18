'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('depend_prop_values', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      propUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      coordinateX: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      coordinateY: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      coordinateZ: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      propValue: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      minX: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      minY: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      minZ: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      maxX: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      maxY: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      maxZ: {
        type: Sequelize.DataTypes.INTEGER,
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
      return Promise.all([queryInterface.dropTable('depend_prop_values', { transaction: t })]);
    });
  },
};
