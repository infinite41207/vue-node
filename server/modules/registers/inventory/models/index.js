const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')
const Enums = require('@enums')

const Box = require('@catalogs/boxes/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')
const Warehouse = require('@catalogs/warehouses/models')
const DeliveryOrder = require('@documents/deliveryOrders/models')

class Inventory extends Model {}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    registratorId: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    registratorType: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    typeOfOperation: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_OPERATION,
      allowNull: false,
    },
    count: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Inventory',
    tableName: 'register_inventory',
    mainModel: true,
  }
)

Inventory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})
Inventory.belongsTo(Customer, {
  foreignKey: 'ownerId',
  as: 'owner',
})
Inventory.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})
Inventory.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box',
})
Inventory.belongsTo(VendorAndCustomer, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})
Inventory.belongsTo(DeliveryOrder, {
  foreignKey: 'orderId',
  as: 'order',
})
Inventory.belongsTo(DeliveryOrder, {
  foreignKey: 'expenseOrderId',
  as: 'expenseOrder',
})

module.exports = Inventory
