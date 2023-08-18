'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('counterparties', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Active', 'Blocked'],
        allowNull: false,
        defaultValue: 'Active',
        index: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      nip: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: false,
      },
      abbreviation: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
      },
      language: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
      },
      packageMaterial: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Folia', 'Karton'],
        allowNull: false,
        defaultValue: 'Karton',
      },
      address: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(50),
      },
      email: {
        type: Sequelize.DataTypes.STRING(100),
      },
      region: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      priceType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      deliverySettings: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      note: {
        type: Sequelize.DataTypes.TEXT,
      },
      commission: {
        type: Sequelize.DataTypes.DECIMAL(5, 2),
      },
      vatRateName: {
        type: Sequelize.DataTypes.STRING,
      },
      vatRate: {
        type: Sequelize.DataTypes.INTEGER,
      },
      customerGroup: {
        type: Sequelize.DataTypes.STRING(200),
      },
      code: {
        type: Sequelize.DataTypes.STRING(9),
      },
      fullName: {
        type: Sequelize.DataTypes.STRING(250),
      },
      website: {
        type: Sequelize.DataTypes.STRING(250),
      },
      externalId: {
        type: Sequelize.DataTypes.STRING(50),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      managerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'employees',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      countryId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'countries',
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
      return Promise.all([queryInterface.dropTable('counterparties', { transaction: t })])
    })
  },
}
