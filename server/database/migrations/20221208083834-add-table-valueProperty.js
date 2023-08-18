'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('value_props', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      valueUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      propUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      propValueUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      propValue: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      fillingRequires: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      checkList: {
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
      paramValueId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'param_values',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      return Promise.all([queryInterface.dropTable('value_props', { transaction: t })]);
    });
  },
};
