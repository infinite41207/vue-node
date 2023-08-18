const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('./index')
const Customer = require('@catalogs/counterparties/models')

class UserCustomer extends Model {}

UserCustomer.init(
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
    modelName: 'UserCustomer',
    tableName: 'user_customers',
  }
)

User.hasMany(UserCustomer, {
  foreignKey: 'userId',
  as: 'customers',
  onDelete: 'cascade',
  hooks: true,
})

UserCustomer.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})

UserCustomer.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

module.exports = UserCustomer
