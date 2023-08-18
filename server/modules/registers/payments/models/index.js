const { DataTypes, Model } = require("sequelize");
const sequelize = require("@database/dbConnection");
const moment = require("moment");

const Currency = require('@catalogs/currencies/models')
const PaymentType = require('@catalogs/paymentTypes/models')
const CashFlowItem = require('@catalogs/cashFlowItems/models')
const Project = require('@catalogs/projects/models')

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    registratorId: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    registratorType: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    date: {
      type: DataTypes.DATE,
      index: true,
    },
    sumPaymentReceipt: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    sumPaymentExpense: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "register_payments",
  }
);

Payment.belongsTo(PaymentType, {
  foreignKey: 'paymentTypeId',
  as: 'paymentType',
})

Payment.belongsTo(CashFlowItem, {
  foreignKey: 'cashFlowItemId',
  as: 'cashFlowItem',
})

Payment.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
})

Payment.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency',
})

module.exports = Payment;
