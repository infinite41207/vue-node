const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const RoleGroup = require('./index')
const User = require('@catalogs/users/models')

class RoleGroupUser extends Model {}

RoleGroupUser.init(
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
    modelName: 'RoleGroupUser',
    tableName: 'role_group_users',
  }
)

RoleGroup.hasMany(RoleGroupUser, {
  foreignKey: 'roleGroupId',
  as: 'users',
  onDelete: 'cascade',
  hooks: true,
})

RoleGroupUser.belongsTo(RoleGroup, {
  foreignKey: 'roleGroupId',
  onDelete: 'CASCADE',
})

RoleGroupUser.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

module.exports = RoleGroupUser
