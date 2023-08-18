const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class InteractionTag extends Model {}

InteractionTag.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'InteractionTag',
    tableName: 'interaction_tags',
    mainModel: true,
  }
)

module.exports = InteractionTag
