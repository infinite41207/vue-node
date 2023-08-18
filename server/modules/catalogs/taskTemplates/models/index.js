const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')
const ExecutorRole = require('@catalogs/executorRoles/models/executorRole')

class TaskTemplate extends Model {}

TaskTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    importance: {
      type: DataTypes.ENUM,
      values: ['HIGHT', 'NORMAL', 'LOW', 'NOT_SET'],
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    executionDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    executionHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    executionMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentDateExecution: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    сheckExecution: {
      type: DataTypes.BOOLEAN,
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
    modelName: 'TaskTemplate',
    tableName: 'task_templates',
    mainModel: true,
  }
)

TaskTemplate.belongsTo(User, {
  foreignKey: 'executorId',
  as: 'executor',
})

TaskTemplate.belongsTo(ExecutorRole, {
  foreignKey: 'executorRoleId',
  as: 'executorRole',
})

TaskTemplate.belongsTo(User, {
  foreignKey: 'checkerId',
  as: 'checker',
})

module.exports = TaskTemplate
