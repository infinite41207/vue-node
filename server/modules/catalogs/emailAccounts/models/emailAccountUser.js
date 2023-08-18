const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const EmmailAccount = require('./emailAccount');
const User = require('@catalogs/users/models');

class EmailAccountUser extends Model {}

EmailAccountUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EmailAccountUser',
    tableName: 'email_account_users',
  }
);

EmailAccountUser.belongsTo(EmmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
});

EmmailAccount.hasMany(EmailAccountUser, {
  foreignKey: 'emailAccountId',
  as: 'users',
});

EmailAccountUser.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = EmailAccountUser;
