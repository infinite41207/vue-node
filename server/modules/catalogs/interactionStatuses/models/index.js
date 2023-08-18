const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class InteractionStatus extends Model {}

InteractionStatus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
    },
    name: {
      type: DataTypes.STRING(150),
    },
    color: {
      type: DataTypes.STRING(50),
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
    },
    predefinedName: {
      type: DataTypes.STRING(50),
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
    modelName: 'InteractionStatus',
    tableName: 'interaction_statuses',
    mainModel: true,
  }
)

module.exports = InteractionStatus
