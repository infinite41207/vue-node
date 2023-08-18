const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const BPDefinition = require('@businessProcesses/definitions/models/definition')

class BPExemplar extends Model {}

BPExemplar.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Paused', 'Executed'],
      allowNull: false,
      defaultValue: 'Active',
      index: true,
    },
    stage: {
      type: DataTypes.TEXT,
    },
    ownerType: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    modelName: 'BPExemplar',
    tableName: 'bp_exemplars',
    mainModel: true,
  }
)

BPExemplar.belongsTo(BPDefinition, {
  foreignKey: 'definitionId',
  as: 'definition',
})

module.exports = BPExemplar
