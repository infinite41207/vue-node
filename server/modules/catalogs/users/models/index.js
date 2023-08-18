const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      index: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    name: {
      type: DataTypes.STRING,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    language: {
      type: DataTypes.STRING(2),
    },
    isConstructor: {
      type: DataTypes.BOOLEAN,
    },
    fullRights: {
      type: DataTypes.BOOLEAN,
    },
    externalUser: {
      type: DataTypes.BOOLEAN,
    },
    abbreviation: {
      type: DataTypes.STRING(10),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    useCustomerAccess: {
      type: DataTypes.BOOLEAN,
    },
    accessFiles: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
    },
    referralToken: {
      type: DataTypes.STRING,
    },
    emailConfirmationToken: {
      type: DataTypes.STRING,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
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
    modelName: 'User',
    tableName: 'users',
    mainModel: true,
  }
)

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get())
  delete values.password
  return values
}

module.exports = User
