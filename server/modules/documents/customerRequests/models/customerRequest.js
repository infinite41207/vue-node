const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const Order = require('@documents/salesOrders/models/order')
const Employee = require('@catalogs/employees/models')
const User = require('@catalogs/users/models')
const CustomerRequestStatus = require('@catalogs/customerRequestStatuses/models')
const OutgoingEmail = require('@documents/outgoingEmails/models')

class CustomerRequest extends Model {}

CustomerRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    versionUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      index: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    state: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      allowNull: false,
      defaultValue: 'Active',
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      defaultValue: 'ZO',
      index: true,
    },
    reference: {
      type: DataTypes.STRING(150),
    },
    date: {
      type: DataTypes.DATE,
    },
    sendingDate: {
      type: DataTypes.DATE,
    },
    ordered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    currency: {
      type: DataTypes.STRING(10),
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
    },
    sumVat: {
      type: DataTypes.DECIMAL(15, 2),
    },
    sumBrutto: {
      type: DataTypes.DECIMAL(15, 2),
    },
    sumNetto: {
      type: DataTypes.DECIMAL(15, 2),
    },
    termsOfPayment: {
      type: DataTypes.STRING(100),
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    executionTerm: {
      type: DataTypes.DATE,
    },
    tags: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    unknownCustomer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerName: {
      type: DataTypes.STRING(200),
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.numberStr
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'CustomerRequest',
    tableName: 'customer_requests',
    mainModel: true,
  }
)

CustomerRequest.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

CustomerRequest.belongsTo(Employee, {
  foreignKey: 'managerId',
  as: 'manager',
})

CustomerRequest.belongsTo(User, {
  foreignKey: 'executorId',
  as: 'executor',
})

CustomerRequest.belongsTo(User, {
  foreignKey: 'constructorId',
  as: 'constr',
})

CustomerRequest.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

CustomerRequest.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
})

CustomerRequest.belongsTo(CustomerRequestStatus, {
  foreignKey: 'statusId',
  as: 'status',
})

CustomerRequest.belongsTo(OutgoingEmail, {
  foreignKey: 'resultEmailId',
  as: 'resultEmail',
})

module.exports = CustomerRequest
