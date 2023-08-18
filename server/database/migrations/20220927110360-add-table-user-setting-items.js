'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_setting_items', {
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
      key: {
        type: Sequelize.DataTypes.STRING(100),
      },
      description: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      isGroup: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      groupId: {
        type: Sequelize.DataTypes.UUID,
      },
      valueType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['number', 'string', 'date', 'boolean', 'ref'],
      },
      refModel: {
        type: Sequelize.DataTypes.STRING(100),
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('user_setting_items', { transaction: t })])
    })
  },
}
