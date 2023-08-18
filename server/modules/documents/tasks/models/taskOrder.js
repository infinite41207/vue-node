const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Task = require('./task');
const SalesOrder = require('@documents/salesOrders/models/order');

class TaskSalesOrder extends Model {}

TaskSalesOrder.init(
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
    modelName: 'TaskSalesOrder',
    tableName: 'task_orders',
  }
);

Task.hasMany(TaskSalesOrder, {
  foreignKey: 'taskId',
  as: 'orders',
  onDelete: 'cascade',
  hooks: true,
});

TaskSalesOrder.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task',
  onDelete: 'CASCADE',
});

TaskSalesOrder.belongsTo(SalesOrder, {
  foreignKey: 'orderId',
  as: 'order',
});

module.exports = TaskSalesOrder;
