const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount');
const IncomingEmail = require('./index');

class InkomingEmailAttachment extends Model {}

InkomingEmailAttachment.init(
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
    path: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checksum: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contentDisposition: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'InkomingEmailAttachment',
    tableName: 'incoming_email_attachments',
  }
);

InkomingEmailAttachment.belongsTo(EmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
});

InkomingEmailAttachment.belongsTo(IncomingEmail, {
  foreignKey: 'emailId',
  as: 'email',
});

IncomingEmail.hasMany(InkomingEmailAttachment, {
  foreignKey: 'emailId',
  as: 'files',
});

module.exports = InkomingEmailAttachment;
