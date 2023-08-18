const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const ViewSettings = require('@config/viewSettings/models')
const UserRole = require('@catalogs/userRoles/models')
const enums = require('@enums')

class Navigation extends Model {}

Navigation.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    isMenu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    path: {
      type: DataTypes.STRING(200),
    },
    placing: {
      type: DataTypes.ENUM,
      values: enums.VERSIONING_METHODS,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isSubsystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isReadOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    authRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    viewType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
    component: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    detailPath: {
      type: DataTypes.STRING(200),
    },
    store: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '',
    },
    lang: {
      type: DataTypes.TEXT,
    },
    paramValues: {
      type: DataTypes.STRING,
    },
    qeryParam: {
      type: DataTypes.STRING,
    },
    hashParam: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Navigation',
    tableName: 'navigations',
  }
)

Navigation.belongsTo(ViewSettings, {
  foreignKey: 'viewId',
  as: 'view',
})

Navigation.belongsTo(UserRole, {
  foreignKey: 'accessRoleId',
  as: 'accessRole',
})

module.exports = Navigation
