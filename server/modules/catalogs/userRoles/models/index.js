const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class UserRole extends Model {}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    key: {
      type: DataTypes.STRING(150),
      allowNull: false,
      index: true,
      unique: true,
      _fullSearch: true,
    },
    readOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    mainModel: true,
  }
)

UserRole.belongsTo(UserRole, {
  foreignKey: 'parentId',
  as: 'parent',
})

module.exports = UserRole
