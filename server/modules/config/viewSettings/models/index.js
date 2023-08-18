const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ViewSettings extends Model {}

ViewSettings.init(
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
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ViewSettings',
    tableName: 'view_settings',
  }
)

module.exports = ViewSettings
