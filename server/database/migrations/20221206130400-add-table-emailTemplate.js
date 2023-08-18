'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_templates', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      baseDocument: {
        type: Sequelize.DataTypes.STRING,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      cc: {
        type: Sequelize.DataTypes.TEXT,
      },
      bcc: {
        type: Sequelize.DataTypes.TEXT,
      },
      executionCondition: {
        type: Sequelize.DataTypes.TEXT,
      },
      recepientsCondition: {
        type: Sequelize.DataTypes.TEXT,
      },
      contentVariantsList: {
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
      return Promise.all([queryInterface.dropTable('email_templates', { transaction: t })])
    })
  },
}
