'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
  '@enums': `${__dirname}/../../modules/enums`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('object_versioning_settings', {
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
      versioningMethod: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.VERSIONING_METHODS,
        allowNull: false,
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
    await queryInterface.dropTable('object_versioning_settings')
  },
}
