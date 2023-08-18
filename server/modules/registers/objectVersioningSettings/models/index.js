const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const enums = require('@enums')

class ObjectVersioningSetting extends Model {}

ObjectVersioningSetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    objectType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      index: true,
      _fullSearch: true,
    },
    versioningMethod: {
      type: DataTypes.ENUM,
      values: enums.VERSIONING_METHODS,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ObjectVersioningSetting',
    tableName: 'object_versioning_settings',
    mainModel: true,
  }
)

module.exports = ObjectVersioningSetting
