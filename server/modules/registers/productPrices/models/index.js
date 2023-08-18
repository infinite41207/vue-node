const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Product = require('@catalogs/products/models')

class ProductPrice extends Model {}

ProductPrice.init(
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
    priceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductPrice',
    tableName: 'product_prices',
    mainModel: true,
  }
)

Product.hasMany(ProductPrice, {
  foreignKey: 'productId',
  as: 'prices',
})

ProductPrice.belongsTo(Product, {
  foreignKey: 'productId',
})

module.exports = ProductPrice
