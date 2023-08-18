const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')

class Notification extends Model {}

Notification.init(
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
    objectName: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['INFO', 'WARNING', 'ERROR'],
      defaul: 'INFO',
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    read: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    mainModel: true,
  }
)

Notification.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

module.exports = Notification
