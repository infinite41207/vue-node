const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')
const Pricelist = require('@documents/pricelists/models/pricelist')

class Discount extends Model {}

Discount.init(
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
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    beginDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    belonging: {
      type: DataTypes.ENUM,
      values: ['main', 'surcharge', 'main_and_surcharge', 'surcharge_and_price', 'all'],
      allowNull: false,
    },
    priceCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    priceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    discountType: {
      type: DataTypes.ENUM,
      values: ['price', 'percent', 'formula'],
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    priceFormula: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    priceFormulaDescription: {
      type: DataTypes.STRING,
    },
    includeMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    priceDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    filters: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    filtersDescription: {
      type: DataTypes.TEXT,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.number
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Discount',
    tableName: 'discounts',
    mainModel: true,
  }
)

Discount.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

Discount.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

Discount.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
  as: 'pricelist',
})

module.exports = Discount
