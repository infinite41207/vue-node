const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const UserRole = require('@catalogs/userRoles/models')

const RoleGroup = require('./index')

class RoleGroupSetting extends Model {}

RoleGroupSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    canRead: {
      type: DataTypes.BOOLEAN,
    },
    canModify: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'RoleGroupSetting',
    tableName: 'role_group_settings',
  }
)

RoleGroupSetting.belongsTo(UserRole, {
  foreignKey: 'userRoleId',
  as: 'userRole',
})

RoleGroup.hasMany(RoleGroupSetting, {
  foreignKey: 'roleGroupId',
  as: 'settings',
  onDelete: 'cascade',
  hooks: true,
})

RoleGroupSetting.belongsTo(RoleGroup, {
  foreignKey: 'roleGroupId',
  onDelete: 'CASCADE',
})

module.exports = RoleGroupSetting
