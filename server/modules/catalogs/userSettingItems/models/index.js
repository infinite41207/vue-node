const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class UserSettingItem extends Model {}

UserSettingItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: false,
      _fullSearch: true,
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
    },
    global: {
      type: DataTypes.BOOLEAN,
    },
    default: {
      type: DataTypes.BOOLEAN,
    },
    groupId: {
      type: DataTypes.UUID,
    },
    valueType: {
      type: DataTypes.ENUM,
      values: ['number', 'string', 'date', 'boolean', 'ref'],
    },
    refModel: {
      type: DataTypes.STRING(100),
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.description
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'UserSettingItem',
    tableName: 'user_setting_items',
    mainModel: true,
  }
)

module.exports = UserSettingItem
