const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require("@enums");
const User = require('@catalogs/users/models')
const Customer = require('@catalogs/counterparties/models')
const Currency = require('@catalogs/currencies/models')
const PaymentType = require('@catalogs/paymentTypes/models')
const CashFlowItem = require('@catalogs/cashFlowItems/models')
const Project = require('@catalogs/projects/models')

class PaymentOperation extends Model {}

PaymentOperation.init(
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
      index: true,
    },
    number: {
      type: DataTypes.STRING(9),
      allowNull: false,
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING(50),
    },
    reference: {
      type: DataTypes.STRING(150),
    },
    typeOfPayment: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_PAYMENT,
      allowNull: false,
      index: true,
    },
    typeOfMovement: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_MOVEMENT,
      allowNull: false,
      index: true,
    },
    comment: {
      type: DataTypes.STRING(250),
    },
    sumPayment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      default: '',
      index: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
    },
    lang: {
      type: DataTypes.TEXT,
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
    modelName: 'PaymentOperation',
    tableName: 'payment_operations',
  }
)

PaymentOperation.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

PaymentOperation.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

PaymentOperation.belongsTo(PaymentType, {
  foreignKey: 'paymentTypeId',
  as: 'paymentType',
})

PaymentOperation.belongsTo(CashFlowItem, {
  foreignKey: 'cashFlowItemId',
  as: 'cashFlowItem',
})

PaymentOperation.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
})

PaymentOperation.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency',
})

module.exports = PaymentOperation
