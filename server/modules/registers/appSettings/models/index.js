const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

class AppSetting extends Model {}

AppSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    valueType: {
      type: DataTypes.ENUM,
      values: ['Number', 'String', 'Boolean', 'Date'],
    },
    name: {
      type: DataTypes.STRING,
    },
    refModelName: {
      type: DataTypes.STRING(50),
    },
    value: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'AppSetting',
    tableName: 'app_settings',
  }
);

module.exports = AppSetting;
