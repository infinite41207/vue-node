const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const SalesOrder = require('./order');
const Product = require('@catalogs/products/models');
const UnitOfMeasure = require('@catalogs/unitsOfMeasure/models');

class SalesOrderItem extends Model {}

SalesOrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    configProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING(150),
    },
    unitOfMeasureStr: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    vat: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    sumBrutto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    sumNetto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    discountSum: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    numberOfPieces: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    length: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    height: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    colour: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    choosenParameters: {
      type: DataTypes.TEXT,
    },
    incompliteParams: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'SalesOrderItem',
    tableName: 'order_items',
  }
);

SalesOrder.hasMany(SalesOrderItem, {
  foreignKey: 'orderId',
  as: 'products',
  onDelete: 'cascade',
  hooks: true,
});

SalesOrderItem.belongsTo(SalesOrder, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
});

SalesOrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

SalesOrderItem.belongsTo(UnitOfMeasure, {
  foreignKey: 'unitOfMeasureId',
  as: 'unitOfMeasure',
});

module.exports = SalesOrderItem;
