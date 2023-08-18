const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')

const Box = require('@catalogs/boxes/models')
const Scale = require('@catalogs/scales/models')
const Disposition = require('@documents/dispositions/models')
const ShipUnloading = require('@documents/shipsUnloading/models')

class PlumbLine extends Model {}

PlumbLine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    beginWeighting: {
      type: DataTypes.DATE,
    },
    endWeighting: {
      type: DataTypes.DATE,
    },
    count: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    enumerator: {
      type: DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PlumbLine',
    tableName: 'register_plumb_lines',
    mainModel: true,
  }
)

PlumbLine.belongsTo(ShipUnloading, {
  foreignKey: 'shipUnloadingId',
  as: 'shipUnloading',
})
PlumbLine.belongsTo(Disposition, {
  foreignKey: 'dispositionId',
  as: 'disposition',
})
PlumbLine.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
PlumbLine.belongsTo(Box, {
  foreignKey: 'boxId',
  as: 'box',
})

module.exports = PlumbLine
