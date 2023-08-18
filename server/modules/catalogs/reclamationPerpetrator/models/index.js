const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclamationPerpetrator extends Model {}

ReclamationPerpetrator.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
    modelName: 'ReclamationPerpetrator',
    tableName: 'reclamation_perpetrators',
    mainModel: true,
  }
)

module.exports = ReclamationPerpetrator
