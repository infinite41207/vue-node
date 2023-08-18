const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')

const Enums = require('@enums')
const User = require('@catalogs/users/models')
const Counterparty = require('@catalogs/counterparties/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const Warehouse = require('@catalogs/warehouses/models')
const Box = require('@catalogs/boxes/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Ship = require('@catalogs/ships/models')
const Product = require('@catalogs/products/models')
const ControlCompany = require('@catalogs/controlCompanies/models')
const Scale = require('@catalogs/scales/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const Assortment = require('@catalogs/assortments/models')

class DeliveryOrder extends Model {}

DeliveryOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING(50),
    },
    date: {
      type: DataTypes.DATE,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      default: '',
      index: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    typeOfOperation: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_OPERATION,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    state: {
      type: DataTypes.ENUM,
      values: Enums.ORDER_STATE,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
    },
    externalId: {
      type: DataTypes.STRING(50),
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    nonOracleLoad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    dateClosing: {
      type: DataTypes.DATE,
    },
    correspondence: {
      type: DataTypes.STRING,
    },
    gmp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    customsStatusOfGoods: {
      type: DataTypes.ENUM,
      values: Enums.CUSTOM_STATE_OF_GOODS,
      allowNull: false,
    },
    customsNumber: {
      type: DataTypes.STRING(50),
    },
    typeOfDocument: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DOCUMENT,
      allowNull: false,
    },
    dateIssueDSK: {
      type: DataTypes.DATE,
    },
    maxDecrease: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    minutesCarService: {
      type: DataTypes.DECIMAL(3, 0),
      allowNull: false,
    },
    useResearch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    isOpenSubOrders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    timeStart: {
      type: DataTypes.DATE,
    },
    timeEnd: {
      type: DataTypes.DATE,
    },
    arrivalsBlockingStart: {
      type: DataTypes.DATE,
    },
    arrivalsBlockingEnd: {
      type: DataTypes.DATE,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Zlecenie nr ${this.numberStr} od ${moment(this.createdAt).format('DD.MM.YYYY HH:mm:ss')}`
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'DeliveryOrder',
    tableName: 'transport_orders',
    mainModel: true,
  }
)

DeliveryOrder.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})
DeliveryOrder.belongsTo(Counterparty, {
  foreignKey: 'counterpartyId',
  as: 'owner',
})
DeliveryOrder.belongsTo(SchemeOfCargo, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
})
DeliveryOrder.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})
DeliveryOrder.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box',
})
DeliveryOrder.belongsTo(VendorAndCustomer, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})
DeliveryOrder.belongsTo(Ship, {
  foreignKey: 'shipId',
  as: 'ship',
})
DeliveryOrder.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})
DeliveryOrder.belongsTo(DeliveryOrder, {
  foreignKey: 'baseId',
  as: 'base',
})
DeliveryOrder.belongsTo(ControlCompany, {
  foreignKey: 'controlCompanyId',
  as: 'controlCompany',
})
DeliveryOrder.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
DeliveryOrder.belongsTo(WeighingStation, {
  foreignKey: 'weighingStationId',
  as: 'weighingStation',
})
DeliveryOrder.belongsTo(Assortment, {
  foreignKey: 'assortmentId',
  as: 'assortment',
})

module.exports = DeliveryOrder
