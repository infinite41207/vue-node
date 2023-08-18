const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Mailbox = require('@common/mailbox/models')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const Counterparty = require('@catalogs/counterparties/models')

class IncomingEmail extends Model {}

IncomingEmail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    from: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    to: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cc: {
      type: DataTypes.TEXT,
    },
    subject: {
      type: DataTypes.TEXT,
    },
    html: {
      type: DataTypes.TEXT,
    },
    attachments: {
      type: DataTypes.TEXT,
    },
    flags: {
      type: DataTypes.TEXT,
    },
    labels: {
      type: DataTypes.TEXT,
    },
    attachmentsAtHardDrive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasLinks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hash: {
      type: DataTypes.STRING(32),
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.subject
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'IncomingEmail',
    tableName: 'incoming_emails',
    mainModel: true,
  }
)

IncomingEmail.belongsTo(EmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
})

IncomingEmail.belongsTo(Mailbox, {
  foreignKey: 'mailboxId',
  as: 'mailbox',
})

IncomingEmail.belongsTo(Counterparty, {
  foreignKey: 'counterpartyId',
  as: 'counterparty',
})

module.exports = IncomingEmail
