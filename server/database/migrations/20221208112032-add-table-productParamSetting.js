'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_parameter_settings', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      customerParam: {
        type: Sequelize.DataTypes.STRING(100),
      },
      customerValueParam: {
        type: Sequelize.DataTypes.STRING(100),
      },
      programCode: {
        type: Sequelize.DataTypes.TEXT,
      },
      paramCalcFactor: {
        type: Sequelize.DataTypes.INTEGER,
      },
      propertyCalcFactor: {
        type: Sequelize.DataTypes.INTEGER,
      },
      hidden: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      customerId: {
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
      parameterId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'product_params',
          },
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      parameterPropertyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'param_props',
          },
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      parameterValueId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'param_values',
          },
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      propertyValueId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'prop_values',
          },
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('product_parameter_settings', { transaction: t })])
    })
  },
}
