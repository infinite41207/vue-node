const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount');
const OutgoingEmail = require('./index');

class OutgoingEmailLink extends Model {}

OutgoingEmailLink.init(
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
    modelName: 'OutgoingEmailLink',
    tableName: 'outgoing_email_links',
  }
);

OutgoingEmailLink.belongsTo(EmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
});

OutgoingEmailLink.belongsTo(OutgoingEmail, {
  foreignKey: 'emailId',
  as: 'email',
});

OutgoingEmail.hasMany(OutgoingEmailLink, {
  foreignKey: 'emailId',
  as: 'links',
});

module.exports = OutgoingEmailLink;
