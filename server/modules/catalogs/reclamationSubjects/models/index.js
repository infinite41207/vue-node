const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ReclamationSubject extends Model {}

ReclamationSubject.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oracleId: {
      type: DataTypes.STRING,
    },
    guarantee: {
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
    modelName: 'ReclamationSubject',
    tableName: 'reclamation_subjects',
    mainModel: true,
  }
)

module.exports = ReclamationSubject
