const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Employee = require('@catalogs/employees/models')
const Currency = require('@catalogs/currencies/models')
const Country = require('@catalogs/countries/models')
const TermOfPayment = require('@catalogs/termsOfPayment/models')

class Counterparty extends Model {}

Counterparty.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Blocked'],
      allowNull: false,
      defaultValue: 'Active',
      index: true,
    },
    nip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    abbreviation: {
      type: DataTypes.STRING(10),
      allowNull: false,
      _fullSearch: true,
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    packageMaterial: {
      type: DataTypes.ENUM,
      values: ['Folia', 'Karton'],
      allowNull: false,
      defaultValue: 'Karton',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    priceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    deliverySettings: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
    },
    vatRateName: {
      type: DataTypes.STRING,
    },
    vatRate: {
      type: DataTypes.INTEGER,
    },
    customerGroup: {
      type: DataTypes.STRING(200),
    },
    code: {
      type: DataTypes.STRING(9),
    },
    fullName: {
      type: DataTypes.STRING(250),
    },
    website: {
      type: DataTypes.STRING(250),
    },
    externalId: {
      type: DataTypes.STRING(50),
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.name}${this.abbreviation ? ` (${this.abbreviation})` : ''}`
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Counterparty',
    tableName: 'counterparties',
    mainModel: true,
  }
)

Counterparty.belongsTo(Employee, {
  foreignKey: 'managerId',
  as: 'manager',
})

Counterparty.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency',
})

Counterparty.belongsTo(Country, {
  foreignKey: 'countryId',
  as: 'country',
})

Counterparty.belongsTo(TermOfPayment, {
  foreignKey: 'termOfPaymentId',
  as: 'termOfPayment',
})

module.exports = Counterparty
