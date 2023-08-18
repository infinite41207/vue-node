'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('navigations', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      isMenu: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      sequence: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      parentId: {
        type: Sequelize.DataTypes.UUID,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      path: {
        type: Sequelize.DataTypes.STRING(200),
      },
      title: {
        type: Sequelize.DataTypes.STRING,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSubsystem: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isReadOnly: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      authRequired: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      viewType: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
      },
      component: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      detailPath: {
        type: Sequelize.DataTypes.STRING(150),
      },
      store: {
        type: Sequelize.DataTypes.STRING,
      },
      model: {
        type: Sequelize.DataTypes.STRING,
      },
      presentation: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      icon: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
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
    return queryInterface.dropTable('navigations')
  },
}
