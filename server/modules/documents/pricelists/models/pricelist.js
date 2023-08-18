const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Product = require('@catalogs/products/models')

class Pricelist extends Model {}

Pricelist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    priceCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(250),
    },
    pricelistKind: {
      type: DataTypes.ENUM,
      values: ['main', 'surcharge'],
      allowNull: false,
      index: true,
    },
    includedInMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notUseDiscount: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    beginDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    pricingMethod: {
      type: DataTypes.ENUM,
      values: ['table', 'scale', 'fixed', 'formula', 'percent'],
      allowNull: false,
    },
    priceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    maxDiscount: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    filters: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    filtersDescription: {
      type: DataTypes.TEXT,
    },
    priceFormula: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    priceFormulaDescription: {
      type: DataTypes.STRING,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.priceCode
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Pricelist',
    tableName: 'pricelists',
    mainModel: true,
  }
)

Product.hasMany(Pricelist, {
  foreignKey: 'productId',
  as: 'product',
})

Pricelist.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

module.exports = Pricelist
