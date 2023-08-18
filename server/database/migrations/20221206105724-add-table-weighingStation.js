'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
  '@enums': `${__dirname}/../../modules/enums`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weighing_stations', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(25),
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(9),
      },
      typeOfDocument: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_DOCUMENT,
        allowNull: false,
      },
      scalesType: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_SCALE,
        allowNull: false,
      },
      barCodePrefix: {
        type: Sequelize.DataTypes.STRING(10),
      },
      automaticWeightingEnd: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
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
      return Promise.all([queryInterface.dropTable('weighing_stations', { transaction: t })])
    })
  },
}
