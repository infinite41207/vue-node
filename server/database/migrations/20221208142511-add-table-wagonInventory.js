'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wagon_inventory', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      lineNumber: {
        type: Sequelize.DataTypes.INTEGER,
      },
      plannedDateOfComposition: {
        type: Sequelize.DataTypes.DATE,
      },
      transportStorageNumber: {
        type: Sequelize.DataTypes.STRING(50),
      },
      orderNumber: {
        type: Sequelize.DataTypes.STRING(50),
      },
      dateAndTimeOfWagForQuay: {
        type: Sequelize.DataTypes.DATE,
      },
      basicWagQuantity: {
        type: Sequelize.DataTypes.STRING(50),
      },
      quantityOfWagShift: {
        type: Sequelize.DataTypes.STRING(50),
      },
      quantityOfWagWhenRemainForWork: {
        type: Sequelize.DataTypes.STRING(50),
      },
      timeOfComplete: {
        type: Sequelize.DataTypes.DATE,
      },
      hourBegunAdjust: {
        type: Sequelize.DataTypes.DATE,
      },
      quantityOfWagAdjust: {
        type: Sequelize.DataTypes.STRING(50),
      },
      hourLawAdjust: {
        type: Sequelize.DataTypes.DATE,
      },
      quantityOfWagWhenRemainForReg: {
        type: Sequelize.DataTypes.STRING(50),
      },
      hoursOfWagFromTerminal: {
        type: Sequelize.DataTypes.DATE,
      },
      comment: {
        type: Sequelize.DataTypes.STRING(50),
      },
      workShifts: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.WORK_SHIFTS,
      },
      totalCompositionTime: {
        type: Sequelize.DataTypes.DECIMAL(10, 1),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      dispositionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'dispositions',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      wharfId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'wharfs',
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('wagon_inventory', { transaction: t })])
    })
  },
}
