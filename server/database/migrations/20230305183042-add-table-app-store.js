'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('app_store', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
        index: true,
      },
      path: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
        index: true,
      },
      handlers: {
        type: Sequelize.DataTypes.TEXT,
      },
      markedToDelete: {
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('app_store', { transaction: t })])
    })
  },
}
