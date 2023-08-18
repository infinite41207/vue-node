const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const SalesOrderItem = require('./orderItem');
const Pricelist = require('@documents/pricelists/models/pricelist');
const Discount = require('@documents/discounts/models');

class SalesOrderPrice extends Model {}

SalesOrderPrice.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    priceType: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    priceCode: {
      type: DataTypes.STRING(50),
    },
    priceDescription: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    sum: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    discountSum: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SalesOrderPrice',
    tableName: 'order_prices',
  }
);

SalesOrderItem.hasMany(SalesOrderPrice, {
  foreignKey: 'orderItemId',
  as: 'prices',
  onDelete: 'cascade',
  hooks: true,
});
SalesOrderPrice.belongsTo(SalesOrderItem, {
  foreignKey: 'orderItemId',
});

SalesOrderPrice.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
  as: 'pricelist',
});

SalesOrderPrice.belongsTo(Discount, {
  foreignKey: 'discountId',
  as: 'discount',
});

module.exports = SalesOrderPrice;
