const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclemetionExecutionType extends Model {}

ReclemetionExecutionType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    oracleId: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.description
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'ReclemetionExecutionType',
    tableName: 'reclamation_executiontypes',
    mainModel: true,
  }
)

module.exports = ReclemetionExecutionType
