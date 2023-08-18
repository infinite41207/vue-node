'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_request_statuses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      code1C: {
        type: Sequelize.DataTypes.STRING,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
      },
      isClosed: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      predefinedName: {
        type: Sequelize.DataTypes.STRING(50),
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
      return Promise.all([queryInterface.dropTable('customer_request_statuses', { transaction: t })])
    })
  },
}
