'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scales', {
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
      scalesNumber: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      scalesVersion: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      address: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: false,
      },
      port: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      updatePeriod: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      scalesType: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_SCALE,
        allowNull: false,
      },
      typeOfDocument: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_DOCUMENT,
        allowNull: false,
      },
      factor: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      deviation: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      iot: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gatewayServer: {
        type: Sequelize.DataTypes.STRING(20),
      },
      gatewayPort: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      gatewayLogin: {
        type: Sequelize.DataTypes.STRING(100),
      },
      gatewayPassword: {
        type: Sequelize.DataTypes.STRING(100),
      },
      gatewayResource: {
        type: Sequelize.DataTypes.STRING(200),
      },
      useVideoRecorder: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      videoRecorderUser: {
        type: Sequelize.DataTypes.STRING(20),
      },
      videoRecorderPassword: {
        type: Sequelize.DataTypes.STRING(20),
      },
      videoRecorderServer: {
        type: Sequelize.DataTypes.STRING(50),
      },
      videoRecorderPort: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      videoRecorderRequest: {
        type: Sequelize.DataTypes.STRING(255),
      },
      videoRecorderPathToFile: {
        type: Sequelize.DataTypes.STRING(255),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      weighingStationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'weighing_stations',
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
      return Promise.all([queryInterface.dropTable('scales', { transaction: t })])
    })
  },
}
