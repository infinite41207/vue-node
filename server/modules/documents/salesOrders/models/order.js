const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const User = require('@catalogs/users/models')
const Currency = require('@catalogs/currencies/models')
const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models')
const TermOfPayment = require('@catalogs/termsOfPayment/models')
const Employee = require('@catalogs/employees/models')

class SalesOrder extends Model {}

SalesOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING,
      index: true,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      index: true,
    },
    reference: {
      type: DataTypes.STRING(150),
    },
    offer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proforma: {
      type: DataTypes.STRING,
    },
    deliveryDate: {
      type: DataTypes.DATE,
    },
    shipmentDate: {
      type: DataTypes.DATE,
    },
    deliveryMethod: {
      type: DataTypes.STRING(50),
    },
    postCode: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    packageMaterial: {
      type: DataTypes.ENUM,
      values: ['Folia', 'Karton'],
      allowNull: false,
    },
    project: {
      type: DataTypes.STRING(100),
    },
    sumVat: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    sumBrutto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    sumNetto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    exchangeComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    incompliteParams: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    comment: {
      type: DataTypes.STRING,
    },
    ownerType: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.INTEGER,
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
    modelName: 'SalesOrder',
    tableName: 'orders',
    mainModel: true,
  }
)

SalesOrder.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

SalesOrder.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

SalesOrder.belongsTo(User, {
  foreignKey: 'responsible',
  as: '_responsible',
})

SalesOrder.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency',
})

SalesOrder.belongsTo(SalesOrderStatus, {
  foreignKey: 'statusId',
  as: 'status',
})

SalesOrder.belongsTo(TermOfPayment, {
  foreignKey: 'termOfPaymentId',
  as: 'termOfPayment',
})

module.exports = SalesOrder
