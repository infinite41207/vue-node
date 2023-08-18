const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Standing = require('@catalogs/standings/models')
const Counterparty = require('@catalogs/counterparties/models')
const Employee = require('@catalogs/employees/models')

class ContactPerson extends Model {}
ContactPerson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(12),
    },
    address: {
      type: DataTypes.STRING(50),
    },
    birthDate: {
      type: DataTypes.DATE,
    },
    sex: {
      type: DataTypes.STRING(20),
    },
    role: {
      type: DataTypes.STRING(50),
    },
    notActive: {
      type: DataTypes.BOOLEAN,
    },
    comment: {
      type: DataTypes.TEXT,
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
    modelName: 'ContactPerson',
    tableName: 'contact_persons',
    mainModel: true,
  }
)

ContactPerson.belongsTo(Counterparty, {
  foreignKey: 'counterpartyId',
  as: 'counterparty',
})

ContactPerson.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee',
})

ContactPerson.belongsTo(Standing, {
  foreignKey: 'standingId',
  as: 'standing',
})

module.exports = ContactPerson
