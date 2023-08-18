const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const moment = require('moment')

const Scale = require('@catalogs/scales/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const User = require('@catalogs/users/models')
const Disposition = require('@documents/dispositions/models')

class WeightedDisposition extends Model {}

WeightedDisposition.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'WeightedDisposition',
    tableName: 'register_weighted_dispositions',
    mainModel: true,
  }
)

WeightedDisposition.belongsTo(Disposition, {
  foreignKey: 'dispositionId',
  as: 'disposition',
})
WeightedDisposition.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
WeightedDisposition.belongsTo(WeighingStation, {
  foreignKey: 'weighingStationId',
  as: 'weighingStation',
})
WeightedDisposition.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

module.exports = WeightedDisposition
