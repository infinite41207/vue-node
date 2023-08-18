'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
      },
      code: {
        type: Sequelize.DataTypes.STRING(11),
        allowNull: false,
      },
      article: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      configProduct: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      imgUrl: {
        type: Sequelize.DataTypes.STRING(250),
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Active', 'Deactive'],
        allowNull: false,
        defaultValue: 'Active',
        index: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      baseSupplierRef: {
        type: Sequelize.DataTypes.STRING,
      },
      baseSupplier: {
        type: Sequelize.DataTypes.STRING,
      },
      itemSupplierArticle: {
        type: Sequelize.DataTypes.STRING,
      },
      store: {
        type: Sequelize.DataTypes.STRING,
      },
      presentation: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
      externalId: {
        type: Sequelize.DataTypes.STRING(50),
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.INVENTORY_TYPE,
        allowNull: false,
      },
      notUsedProductCondition: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      distinguishFont: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      presentationColor: {
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
      unitOfMeasureId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'unit_of_measures',
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
      return Promise.all([queryInterface.dropTable('products', { transaction: t })])
    })
  },
}
