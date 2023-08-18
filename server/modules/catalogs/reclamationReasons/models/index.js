const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclamationReason extends Model {}

ReclamationReason.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
      _fullSearch: true,
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
    modelName: 'ReclamationReason',
    tableName: 'reclamation_reasons',
    mainModel: true,
  }
)

module.exports = ReclamationReason
