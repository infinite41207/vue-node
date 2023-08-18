const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Enums = require('@enums')

const ScaleProtocol = require('@catalogs/scaleProtocols/models')
class ConfigS7 extends Model {}

ConfigS7.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    server: {
      type: DataTypes.STRING(15),
    },
    valueType: {
      type: DataTypes.STRING(20),
    },
    register: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    sequelize,
    modelName: 'ConfigS7',
    tableName: 'scale_protocols_config_s7',
  }
)

ScaleProtocol.hasMany(ConfigS7, {
  foreignKey: 'parentId',
  as: 'configS7',
  onDelete: 'CASCADE',
  hooks: true,
})

ConfigS7.belongsTo(ScaleProtocol, {
  foreignKey: 'parentId',
  as: 'scaleProtocol',
  onDelete: 'CASCADE',
})

module.exports = ConfigS7
