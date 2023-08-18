'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('view_settings', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(250),
        allowNull: false,
        index: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      template: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      module: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      style: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: '',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('view_settings', { transaction: t })])
    })
  },
}
