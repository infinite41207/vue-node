const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')
const UserSettingItem = require('@catalogs/userSettingItems/models')

class UserSetting extends Model {}

UserSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    valueType: {
      type: DataTypes.ENUM,
      values: ['number', 'string', 'date', 'boolean', 'ref'],
    },
    valueNumber: {
      type: DataTypes.DECIMAL(15, 2),
    },
    valueString: {
      type: DataTypes.STRING,
    },
    valueDate: {
      type: DataTypes.DATE,
    },
    valueBoolean: {
      type: DataTypes.BOOLEAN,
    },
    valueRef: {
      type: DataTypes.UUID,
    },
    refModel: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    modelName: 'UserSetting',
    tableName: 'user_settings',
    mainModel: true,
  }
)

UserSetting.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

UserSetting.belongsTo(UserSettingItem, {
  foreignKey: 'userSettingItemId',
  as: 'userSettingItem',
})

module.exports = UserSetting
