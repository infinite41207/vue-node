const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')
const ExecutorRole = require('./executorRole')

class TaskExecutor extends Model {}

TaskExecutor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TaskExecutor',
    tableName: 'task_executors',
  }
)

TaskExecutor.belongsTo(User, {
  foreignKey: 'executorId',
  as: 'executor',
})

TaskExecutor.belongsTo(ExecutorRole, {
  foreignKey: 'executorRoleId',
  as: 'executorRole',
})

ExecutorRole.hasMany(TaskExecutor, {
  foreignKey: 'executorRoleId',
  as: 'executors',
  onDelete: 'cascade',
  hooks: true,
})

module.exports = TaskExecutor
