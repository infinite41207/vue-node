'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('access_restrictions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      objectType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        index: true,
      },
      useRestriction: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      useDepartmentRestriction: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('access_restrictions', { transaction: t })])
    })
  },
}
