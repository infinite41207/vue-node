'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('disp_statuses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        index: true,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
      },
      lang: {
        type: Sequelize.DataTypes.STRING(9),
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      key: {
        type: Sequelize.DataTypes.STRING(50),
        index: true,
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
      return Promise.all([queryInterface.dropTable('disp_statuses', { transaction: t })])
    })
  },
}
