const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const BPExemplar = require('@businessProcesses/bp/models')

class BPHistory extends Model {}

BPHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    stage: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'BPHistory',
    tableName: 'bp_histories',
    mainModel: true,
  }
)

BPHistory.belongsTo(BPExemplar, {
  foreignKey: 'exemplarId',
  as: 'exemplar',
})

module.exports = BPHistory
