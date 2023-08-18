const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require('@enums')
const User = require('@catalogs/users/models')
const Box = require('@catalogs/boxes/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Driver = require('@catalogs/drivers/models')
const Product = require('@catalogs/products/models')
const Position = require('@catalogs/positions/models')
const Scale = require('@catalogs/scales/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const Ship = require('@catalogs/ships/models')
const Vehicle = require('@catalogs/vehicles/models')
const Warehouse = require('@catalogs/warehouses/models')
const Mine = require('@catalogs/mines/models')
const Disposition = require('@documents/dispositions/models')

class DeliveryNote extends Model {}

DeliveryNote.init(
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
    brutto: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    bruttoTime: {
      type: DataTypes.DATE,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    netto: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    nettoTime: {
      type: DataTypes.DATE,
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 3),
    },
    state: {
      type: DataTypes.ENUM,
      values: Enums.DELIVERY_NOTE_STATE,
    },
    tare: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    tareTime: {
      type: DataTypes.DATE,
    },
    trainNumber: {
      type: DataTypes.STRING(20),
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
    cancelWeighting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    approvedDate: {
      type: DataTypes.DATE,
    },
    customsNumber: {
      type: DataTypes.STRING,
    },
    dateIssueDSK: {
      type: DataTypes.DATE,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.numberStr
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'DeliveryNote',
    tableName: 'delivery_notes',
    mainModel: true,
  }
)

DeliveryNote.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})
DeliveryNote.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})
DeliveryNote.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box', //
})
DeliveryNote.belongsTo(User, {
  foreignKey: 'bruttoAuthorId',
  as: 'bruttoAuthor',
})
DeliveryNote.belongsTo(VendorAndCustomer, {
  foreignKey: 'customerId',
  as: 'customer',
})

DeliveryNote.belongsTo(Disposition, {
  foreignKey: 'dispositionId',
  as: 'disposition',
})

Disposition.hasMany(DeliveryNote, {
  foreignKey: 'dispositionId',
  as: 'deliveryNotes',
})

DeliveryNote.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver',
})
DeliveryNote.belongsTo(VendorAndCustomer, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})
DeliveryNote.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})
DeliveryNote.belongsTo(User, {
  foreignKey: 'nettoAuthorId',
  as: 'nettoAuthor',
})
DeliveryNote.belongsTo(Position, {
  foreignKey: 'positionId',
  as: 'position',
})
DeliveryNote.belongsTo(Scale, {
  foreignKey: 'scaleBruttoId',
  as: 'scaleBrutto',
})
DeliveryNote.belongsTo(Scale, {
  foreignKey: 'scaleTareId',
  as: 'scaleTare',
})
DeliveryNote.belongsTo(Scale, {
  foreignKey: 'scaleNettoId',
  as: 'scaleNetto',
})
DeliveryNote.belongsTo(SchemeOfCargo, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
})
DeliveryNote.belongsTo(Ship, {
  foreignKey: 'shipId',
  as: 'ship',
})
DeliveryNote.belongsTo(User, {
  foreignKey: 'tareAuthorId',
  as: 'tareAuthor',
})
DeliveryNote.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
})
DeliveryNote.belongsTo(Vehicle, {
  foreignKey: 'trailerId',
  as: 'trailer',
})
DeliveryNote.belongsTo(VendorAndCustomer, {
  foreignKey: 'vendorId',
  as: 'vendor',
})
DeliveryNote.belongsTo(User, {
  foreignKey: 'approvedAuthorId',
  as: 'approvedAuthor',
})
DeliveryNote.belongsTo(Mine, {
  foreignKey: 'mineId',
  as: 'mine',
})

module.exports = DeliveryNote
