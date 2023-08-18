const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const Pricelist = require('./pricelist')

class PricelistCustomer extends Model {}

PricelistCustomer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PricelistCustomer',
    tableName: 'pricelist_customers',
  }
)

Pricelist.hasMany(PricelistCustomer, {
  foreignKey: 'pricelistId',
  as: 'customers',
})

PricelistCustomer.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
})

PricelistCustomer.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

module.exports = PricelistCustomer
