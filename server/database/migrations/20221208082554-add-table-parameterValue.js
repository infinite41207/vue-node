'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('param_values', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      rowUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      paramUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false,
      },
      nextParamUuid: {
        type: Sequelize.DataTypes.STRING(36),
      },
      state: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      hidden: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      descr: {
        type: Sequelize.DataTypes.STRING(300),
      },
      strNumber: {
        type: Sequelize.DataTypes.STRING(2),
      },
      messageDescr: {
        type: Sequelize.DataTypes.STRING(300),
      },
      filterDefault: {
        type: Sequelize.DataTypes.TEXT,
      },
      filter: {
        type: Sequelize.DataTypes.TEXT,
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
      return Promise.all([queryInterface.dropTable('param_values', { transaction: t })]);
    });
  },
};
