const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class BPDefinition extends Model {}

BPDefinition.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    stages: {
      type: DataTypes.TEXT,
    },
    stageSettingsList: {
      type: DataTypes.TEXT,
    },
    onExecution: {
      type: DataTypes.TEXT,
    },
    ownerObject: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'BPDefinition',
    tableName: 'bp_definitions',
    mainModel: true,
  }
)

module.exports = BPDefinition
