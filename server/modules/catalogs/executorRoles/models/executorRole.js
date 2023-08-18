const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ExecutorRoles extends Model {}

ExecutorRoles.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    code: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'ExecutorRoles',
    tableName: 'executor_roles',
    mainModel: true,
  }
)

module.exports = ExecutorRoles
