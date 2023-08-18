const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclamationStatusGroup extends Model {}

ReclamationStatusGroup.init(
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
    sortId: {
      type: DataTypes.INTEGER,
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
    modelName: 'ReclamationStatusGroup',
    tableName: 'reclamation_statusgroups',
    mainModel: true,
  }
)

module.exports = ReclamationStatusGroup
