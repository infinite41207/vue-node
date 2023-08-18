const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Mailbox = require('@common/mailbox/models')
const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')
const Counterparty = require('@catalogs/counterparties/models')

class OutgoingEmail extends Model {}

OutgoingEmail.init(
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
    to: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cc: {
      type: DataTypes.TEXT,
    },
    bcc: {
      type: DataTypes.TEXT,
    },
    subject: {
      type: DataTypes.TEXT,
    },
    body: {
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
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    modelName: 'OutgoingEmail',
    tableName: 'outgoing_emails',
    mainModel: true,
  }
)

OutgoingEmail.belongsTo(EmailAccount, {
  foreignKey: 'fromId',
  as: 'from',
})

OutgoingEmail.belongsTo(Mailbox, {
  foreignKey: 'mailboxId',
  as: 'mailbox',
})

OutgoingEmail.belongsTo(Counterparty, {
  foreignKey: 'counterpartyId',
  as: 'counterparty',
})

module.exports = OutgoingEmail
