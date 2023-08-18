const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclamationType extends Model {}

ReclamationType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    printName: {
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
    modelName: 'ReclamationType',
    tableName: 'reclamation_types',
    mainModel: true,
  }
)

module.exports = ReclamationType
