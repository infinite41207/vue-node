const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Enums = require('@enums')

const Warehouse = require('@catalogs/warehouses/models')

class SchemeOfCargo extends Model {}

SchemeOfCargo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(9),
    },
    typeOfOperation: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_OPERATION,
      allowNull: false,
    },
    typeOfDocument: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DOCUMENT,
      allowNull: false,
    },
    moving: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    ship: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING(10),
    },
    reverseOperation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    returnToWarehouse: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    disableControlOnScales: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    disableControlInDispositions: {
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
    modelName: 'SchemeOfCargo',
    tableName: 'schemes_of_cargo',
    mainModel: true,
  }
)

SchemeOfCargo.belongsTo(Warehouse, {
  foreignKey: 'defaultWarehouseId',
  as: 'defaultWarehouse',
})

module.exports = SchemeOfCargo
