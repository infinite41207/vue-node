'use strict'
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@enums': `${__dirname}/../../modules/enums`,
})
const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendars', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
      },
      color: {
        type: Sequelize.DataTypes.STRING,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.CALENDAR_TYPE,
        allowNull: false,
        defaultValue: 'private',
      },
      ownerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
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
      return Promise.all([queryInterface.dropTable('calendars', { transaction: t })])
    })
  },
}
