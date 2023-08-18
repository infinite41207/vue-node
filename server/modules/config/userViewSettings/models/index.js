const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const ViewSettings = require('@config/viewSettings/models')
const User = require('@catalogs/users/models')

class UserViewSettings extends Model {}

UserViewSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    template: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    module: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    style: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'UserViewSettings',
    tableName: 'user_view_settings',
  }
)

UserViewSettings.belongsTo(ViewSettings, {
  foreignKey: 'viewId',
  as: 'originalView',
})

UserViewSettings.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

module.exports = UserViewSettings
