'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_roles', {
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
      key: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        index: true,
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      return Promise.all([queryInterface.dropTable('user_roles', { transaction: t })])
    })
  },
}
