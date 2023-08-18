const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const User = require('@catalogs/users/models')

class ObjectVersion extends Model {}

ObjectVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    objectId: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    objectType: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    objectData: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'ObjectVersion',
    tableName: 'object_versions',
    mainModel: true,
  }
)

ObjectVersion.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

module.exports = ObjectVersion
