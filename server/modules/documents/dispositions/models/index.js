const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')

const Enums = require('@enums')

const User = require('@catalogs/users/models')
const Box = require('@catalogs/boxes/models')
const Carrier = require('@catalogs/carriers/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Driver = require('@catalogs/drivers/models')
const Product = require('@catalogs/products/models')
const Position = require('@catalogs/positions/models')
const Scale = require('@catalogs/scales/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const Ship = require('@catalogs/ships/models')
const Vehicle = require('@catalogs/vehicles/models')
const Warehouse = require('@catalogs/warehouses/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const Mine = require('@catalogs/mines/models')
const Assortment = require('@catalogs/assortments/models')
const DispositionStatus = require('@catalogs/dispositionStatuses/models')

const DeliveryOrder = require('@documents/deliveryOrders/models')

class Disposition extends Model {}

Disposition.init(
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
      default: 'AAA',
      index: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    numberOfWeighings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfWeighted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productCondition: {
      type: DataTypes.STRING(50),
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 3),
    },
    trainNumber: {
      type: DataTypes.STRING(20),
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DISPOSITION,
      allowNull: false,
    },
    typeOfDocument: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DOCUMENT,
      allowNull: false,
    },
    typeOfOperation: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_OPERATION,
      allowNull: false,
    },
    beginWeighting: {
      type: DataTypes.DATE,
    },
    endWeighting: {
      type: DataTypes.DATE,
    },
    netto: {
      type: DataTypes.DECIMAL(15, 3),
    },
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    state: {
      type: DataTypes.ENUM,
      values: Enums.DISPOSITION_STATE,
      allowNull: false,
    },
    ratified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    firstQuantity: {
      type: DataTypes.DECIMAL(15, 3),
    },
    advicesNumber: {
      type: DataTypes.STRING(10),
    },
    approvedDate: {
      type: DataTypes.DATE,
    },
    deliveryNoteNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    firstWeight: {
      type: DataTypes.DECIMAL(15, 3),
    },
    arrivalDateDriver: {
      type: DataTypes.DATE,
    },
    correspondence: {
      type: DataTypes.TEXT,
    },
    driverPhoneNumber: {
      type: DataTypes.STRING(12),
    },
    carsQueueStatus: {
      type: DataTypes.ENUM,
      values: Enums.CAR_QUEUE_STATUS,
    },
    useResearch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    researchResult: {
      type: DataTypes.ENUM,
      values: Enums.RESEARCH_RESULT,
    },
    createInSystemSkup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    gmp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    gmpCheck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    retarning: {
      type: DataTypes.DECIMAL(5, 0),
    },
    allowRetaring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    customsNumber: {
      type: DataTypes.STRING,
    },
    dateIssueDSK: {
      type: DataTypes.DATE,
    },
    researchDate: {
      type: DataTypes.DATE,
    },
    datePlannedService: {
      type: DataTypes.DATE,
    },
    allowSetZero: {
      type: DataTypes.BOOLEAN,
      default: false,
    },

    barCode: {
      type: DataTypes.STRING(20),
    },
    driverTicket: {
      type: DataTypes.STRING(10),
    },
    entryTicket: {
      type: DataTypes.STRING(40),
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Dyspozycja nr ${this.numberStr} od ${moment(this.createdAt).format('DD.MM.YYYY HH:mm:ss')}`
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Disposition',
    tableName: 'dispositions',
    mainModel: true,
  }
)

Disposition.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})
Disposition.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box',
})
Disposition.belongsTo(Carrier, {
  foreignKey: 'carrierId',
  as: 'carrier',
})
Disposition.belongsTo(VendorAndCustomer, {
  foreignKey: 'customerId',
  as: 'customer',
})
Disposition.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver',
})
Disposition.belongsTo(VendorAndCustomer, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})
Disposition.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})
Disposition.belongsTo(DeliveryOrder, {
  foreignKey: 'orderId',
  as: 'order',
})
Disposition.belongsTo(Position, {
  foreignKey: 'positionId',
  as: 'position',
})
Disposition.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
Disposition.belongsTo(Scale, {
  foreignKey: 'scaleTwoId',
  as: 'scaleTwo',
})
Disposition.belongsTo(SchemeOfCargo, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
})
Disposition.belongsTo(Ship, {
  foreignKey: 'shipId',
  as: 'ship',
})
Disposition.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
})
Disposition.belongsTo(Vehicle, {
  foreignKey: 'trailerId',
  as: 'trailer',
})
Disposition.belongsTo(VendorAndCustomer, {
  foreignKey: 'vendorId',
  as: 'vendor',
})
Disposition.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})
Disposition.belongsTo(Warehouse, {
  foreignKey: 'actualWarehouseId',
  as: 'actualWarehouse',
})
Disposition.belongsTo(WeighingStation, {
  foreignKey: 'weighingStationId',
  as: 'weighingStation',
})
Disposition.belongsTo(Mine, {
  foreignKey: 'mineId',
  as: 'mine',
})
Disposition.belongsTo(Assortment, {
  foreignKey: 'assortmentId',
  as: 'assortment',
})
Disposition.belongsTo(DispositionStatus, {
  foreignKey: 'statusId',
  as: 'status',
})

module.exports = Disposition
