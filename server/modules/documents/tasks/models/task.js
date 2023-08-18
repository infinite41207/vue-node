const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const SalesOrder = require('@documents/salesOrders/models/order')
const User = require('@catalogs/users/models')
const ExecutorRole = require('@catalogs/executorRoles/models/executorRole')
const TaskTemplate = require('@catalogs/taskTemplates/models')

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    started: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    authorName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    importance: {
      type: DataTypes.ENUM,
      values: ['HIGHT', 'NORMAL', 'LOW', 'NOT_SET'],
      allowNull: false,
    },
    executionPeriod: {
      type: DataTypes.DATE,
    },
    executorName: {
      type: DataTypes.STRING(50),
    },
    executed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    executionDate: {
      type: DataTypes.DATE,
    },
    executionAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    executionAcceptanceDate: {
      type: DataTypes.DATE,
    },
    executionResult: {
      type: DataTypes.TEXT,
    },
    executionHistory: {
      type: DataTypes.TEXT,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    subjectString: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    emailFrom: {
      type: DataTypes.STRING(100),
    },
    emailId: {
      type: DataTypes.INTEGER,
    },
    emailTitle: {
      type: DataTypes.STRING(1024),
    },
    emailBodyType: {
      type: DataTypes.ENUM,
      values: ['html', 'text'],
      allowNull: false,
    },
    emailBody: {
      type: DataTypes.TEXT,
    },
    emailPriority: {
      type: DataTypes.STRING(25),
    },
    emailCategory: {
      type: DataTypes.STRING(150),
    },
    emailDate: {
      type: DataTypes.DATE,
    },
    fromErp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ownerType: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.UUID,
    },
    bpDefinition: {
      type: DataTypes.INTEGER,
    },
    stage: {
      type: DataTypes.INTEGER,
    },
    parentTask: {
      type: DataTypes.INTEGER,
    },
    checkExecution: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checkResult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.number
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    mainModel: true,
  }
)

Task.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

Task.belongsTo(User, {
  foreignKey: 'executorId',
  as: 'executor',
})

Task.belongsTo(User, {
  foreignKey: 'checkerId',
  as: 'checker',
})

Task.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

Task.belongsTo(ExecutorRole, {
  foreignKey: 'executorRoleId',
  as: 'executorRole',
})

Task.belongsTo(SalesOrder, {
  foreignKey: 'orderId',
  as: 'order',
})

Task.belongsTo(TaskTemplate, {
  foreignKey: 'templateId',
  as: 'template',
})

module.exports = Task
