'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
  '@enums': `${__dirname}/../../modules/enums`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transport_orders', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      numberStr: {
        type: Sequelize.DataTypes.STRING(50),
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      prefix: {
        type: Sequelize.DataTypes.STRING(4),
        allowNull: false,
        default: 'AAA',
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      typeOfOperation: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_OPERATION,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
      },
      state: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.ORDER_STATE,
        allowNull: false,
      },
      comment: {
        type: Sequelize.DataTypes.STRING,
      },
      externalId: {
        type: Sequelize.DataTypes.STRING(50),
      },
      quantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      nonOracleLoad: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      dateClosing: {
        type: Sequelize.DataTypes.DATE,
      },
      correspondence: {
        type: Sequelize.DataTypes.STRING,
      },
      gmp: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      customsStatusOfGoods: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.CUSTOM_STATE_OF_GOODS,
        allowNull: false,
      },
      customsNumber: {
        type: Sequelize.DataTypes.STRING(50),
      },
      typeOfDocument: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_DOCUMENT,
        allowNull: false,
      },
      dateIssueDSK: {
        type: Sequelize.DataTypes.DATE,
      },
      maxDecrease: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      minutesCarService: {
        type: Sequelize.DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      useResearch: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      isOpenSubOrders: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      timeStart: {
        type: Sequelize.DataTypes.DATE,
      },
      timeEnd: {
        type: Sequelize.DataTypes.DATE,
      },
      arrivalsBlockingStart: {
        type: Sequelize.DataTypes.DATE,
      },
      arrivalsBlockingEnd: {
        type: Sequelize.DataTypes.DATE,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      counterpartyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'counterparties',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      schemeOfCargoId: {
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
      warehouseId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'warehouses',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      boxId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'boxes',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      forwarderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'vendor_and_customers',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      shipId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'ships',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      baseId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'transport_orders',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      controlCompanyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'control_companies',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      scaleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'scales',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      assortmentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'assortments',
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
      return Promise.all([queryInterface.dropTable('transport_orders', { transaction: t })])
    })
  },
}
