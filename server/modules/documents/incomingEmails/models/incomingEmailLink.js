const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount');
const IncomingEmail = require('./index');

class InkomingEmailLink extends Model {}

InkomingEmailLink.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    emailUid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'InkomingEmailLink',
    tableName: 'incoming_email_links',
  }
);

InkomingEmailLink.belongsTo(EmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
});

InkomingEmailLink.belongsTo(IncomingEmail, {
  foreignKey: 'emailId',
  as: 'email',
});

IncomingEmail.hasMany(InkomingEmailLink, {
  foreignKey: 'emailId',
  as: 'links',
});

module.exports = InkomingEmailLink;
