const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ControlCompany extends Model {}

ControlCompany.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(9),
    },
    comment: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'ControlCompany',
    tableName: 'control_companies',
    mainModel: true,
  }
)

module.exports = ControlCompany
