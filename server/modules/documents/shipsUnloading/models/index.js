const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')

const User = require('@catalogs/users/models')
const Warehouse = require('@catalogs/warehouses/models')
const Box = require('@catalogs/boxes/models')
const Position = require('@catalogs/positions/models')
const Scale = require('@catalogs/scales/models')
const Disposition = require('@documents/dispositions/models')

class ShipUnloading extends Model {}

ShipUnloading.init(
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
    comment: {
      type: DataTypes.STRING,
    },
    netto: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    beginWeighting: {
      type: DataTypes.DATE,
    },
    endWeighting: {
      type: DataTypes.DATE,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return `Rozładunek statku nr ${this.numberStr} od ${moment(this.date).format('DD.MM.YYYY HH:mm:ss')}`
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'ShipUnloading',
    tableName: 'ships_unloading',
    mainModel: true,
  }
)

ShipUnloading.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})
ShipUnloading.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box',
})
ShipUnloading.belongsTo(Disposition, {
  foreignKey: 'dispositionId',
  as: 'disposition',
})
ShipUnloading.belongsTo(Position, {
  foreignKey: 'positionId',
  as: 'position',
})
ShipUnloading.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
ShipUnloading.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})

module.exports = ShipUnloading
