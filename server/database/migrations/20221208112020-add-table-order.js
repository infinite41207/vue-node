'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      numberStr: {
        type: Sequelize.DataTypes.STRING,
        index: true,
      },
      prefix: {
        type: Sequelize.DataTypes.STRING(4),
        allowNull: false,
        index: true,
      },
      reference: {
        type: Sequelize.DataTypes.STRING(150),
      },
      offer: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      proforma: {
        type: Sequelize.DataTypes.STRING,
      },
      deliveryDate: {
        type: Sequelize.DataTypes.DATE,
      },
      shipmentDate: {
        type: Sequelize.DataTypes.DATE,
      },
      deliveryMethod: {
        type: Sequelize.DataTypes.STRING(50),
      },
      postCode: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      packageMaterial: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Folia', 'Karton'],
        allowNull: false,
      },
      project: {
        type: Sequelize.DataTypes.STRING(100),
      },
      sumVat: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      sumBrutto: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      sumNetto: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      exchangeComplete: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      incompliteParams: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      comment: {
        type: Sequelize.DataTypes.STRING,
      },
      ownerType: {
        type: Sequelize.DataTypes.STRING,
      },
      ownerId: {
        type: Sequelize.DataTypes.INTEGER,
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
      responsible: {
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
      currencyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'currencies',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      statusId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'sales_order_statuses',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      termOfPaymentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'terms_of_payment',
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
      return Promise.all([queryInterface.dropTable('orders', { transaction: t })])
    })
  },
}
