'use strict'
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
})
const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(12),
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TRANSPORT_TYPE,
        allowNull: false,
      },
      tare: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      loadCapacity: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      trackModelId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'track_models',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      carrierId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'carriers',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('vehicles', { transaction: t })])
    })
  },
}
