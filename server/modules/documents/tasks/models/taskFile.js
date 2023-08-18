const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Task = require('./task');

class TaskFile extends Model {}

TaskFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TaskFile',
    tableName: 'task_files',
  }
);

Task.hasMany(TaskFile, {
  foreignKey: 'taskId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});

TaskFile.belongsTo(Task, {
  foreignKey: 'taskId',
  onDelete: 'cascade',
});

module.exports = TaskFile;
