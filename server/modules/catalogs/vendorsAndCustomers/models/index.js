const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class VendorAndCustomer extends Model {}

VendorAndCustomer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(9),
    },
    isCustomer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    isVendor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    isForwarder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    notUse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    numberOfCopies: {
      type: DataTypes.DECIMAL(10, 0),
    },
    fullName: {
      type: DataTypes.STRING(250),
    },
    useActualWarehouse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    sendDriversSms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    useProductCondition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'VendorAndCustomer',
    tableName: 'vendor_and_customers',
    mainModel: true,
  }
)

module.exports = VendorAndCustomer
