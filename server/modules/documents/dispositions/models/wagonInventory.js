const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')
const Carrier = require('@catalogs/carriers/models')
const Product = require('@catalogs/products/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Wharf = require('@catalogs/wharfs/models')
const Enums = require('@enums')
const Disposition = require('@documents/dispositions/models')

class WagonInventory extends Model {}

WagonInventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    lineNumber: {
      type: DataTypes.INTEGER,
    },
    plannedDateOfComposition: {
      type: DataTypes.DATE,
    },
    transportStorageNumber: {
      type: DataTypes.STRING(50),
    },
    orderNumber: {
      type: DataTypes.STRING(50),
    },
    dateAndTimeOfWagForQuay: {
      type: DataTypes.DATE,
    },
    basicWagQuantity: {
      type: DataTypes.STRING(50),
    },
    quantityOfWagShift: {
      type: DataTypes.STRING(50),
    },
    quantityOfWagWhenRemainForWork: {
      type: DataTypes.STRING(50),
    },
    timeOfComplete: {
      type: DataTypes.DATE,
    },
    hourBegunAdjust: {
      type: DataTypes.DATE,
    },
    quantityOfWagAdjust: {
      type: DataTypes.STRING(50),
    },
    hourLawAdjust: {
      type: DataTypes.DATE,
    },
    quantityOfWagWhenRemainForReg: {
      type: DataTypes.STRING(50),
    },
    hoursOfWagFromTerminal: {
      type: DataTypes.DATE,
    },
    comment: {
      type: DataTypes.STRING(50),
    },
    workShifts: {
      type: DataTypes.ENUM,
      values: Enums.WORK_SHIFTS,
    },
    totalCompositionTime: {
      type: DataTypes.DECIMAL(10, 1),
    },
  },
  {
    sequelize,
    modelName: 'WagonInventory',
    tableName: 'wagon_inventory',
  }
)

WagonInventory.belongsTo(Disposition, {
  foreignKey: 'dispositionId',
  as: 'disposition',
  onDelete: 'cascade',
})
WagonInventory.belongsTo(Wharf, {
  foreignKey: 'wharfId',
  as: 'wharf',
})
WagonInventory.belongsTo(VendorAndCustomer, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
})
WagonInventory.belongsTo(Carrier, {
  foreignKey: 'carrierId',
  as: 'carrier',
})
WagonInventory.belongsTo(SchemeOfCargo, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
})
WagonInventory.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})
WagonInventory.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

module.exports = WagonInventory
