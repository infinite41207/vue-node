'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('param_props', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      paramUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      dataType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      codeName: {
        type: Sequelize.DataTypes.STRING(100),
      },
      expression: {
        type: Sequelize.DataTypes.TEXT,
      },
      fillingRequires: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      fillFrom: {
        type: Sequelize.DataTypes.STRING(50),
      },
      confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      depended: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      information: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lang: {
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
      paramId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'product_params',
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
      return Promise.all([queryInterface.dropTable('param_props', { transaction: t })]);
    });
  },
};
