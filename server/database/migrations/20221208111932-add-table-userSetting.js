'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_settings', {
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
      valueType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['number', 'string', 'date', 'boolean', 'ref'],
      },
      valueNumber: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
      },
      valueString: {
        type: Sequelize.DataTypes.STRING,
      },
      valueDate: {
        type: Sequelize.DataTypes.STRING,
      },
      valueBoolean: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      valueRef: {
        type: Sequelize.DataTypes.INTEGER,
      },
      refModel: {
        type: Sequelize.DataTypes.STRING(50),
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userSettingItemId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'user_setting_items',
          },
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('user_settings', { transaction: t })]);
    });
  },
};
