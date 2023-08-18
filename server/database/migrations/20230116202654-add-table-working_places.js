'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('working_places', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(50),
      },
      computerName: {
        type: Sequelize.DataTypes.STRING(50),
      },
      control: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      networkPort: {
        type: Sequelize.DataTypes.INTEGER,
        default: 0,
      },
      numberOfCopies: {
        type: Sequelize.DataTypes.INTEGER,
        default: 1,
      },
      orientation: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.ORIENTATION,
        allowNull: false,
      },
      pageSize: {
        type: Sequelize.DataTypes.STRING(10),
      },
      desibleWorkingInSeveralSessions: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      raisingRailwayDisposition: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      isRollPrinter: {
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
      scaleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'scales',
          },
          key: 'id',
        },
      },
      weighingStationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'weighing_stations',
          },
          key: 'id',
        },
      },
      dispositionsSchemeOfCargoId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'schemes_of_cargo',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      clientIdSerial: {
        type: Sequelize.DataTypes.TEXT('long'),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('schemes_of_cargo_external_codes', { transaction: t })])
    })
  },
}
