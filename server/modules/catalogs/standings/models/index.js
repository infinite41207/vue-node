const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Standing extends Model {}

Standing.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
    modelName: 'Standing',
    tableName: 'standings',
    mainModel: true,
  }
)

module.exports = Standing
