const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const EmailAccount = require('@catalogs/emailAccounts/models/emailAccount')

class Mailbox extends Model {}

Mailbox.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parent: {
      type: DataTypes.STRING,
    },
    delimiter: {
      type: DataTypes.STRING,
    },
    attribs: {
      type: DataTypes.TEXT,
    },
    total: {
      type: DataTypes.INTEGER,
    },
    nextUid: {
      type: DataTypes.INTEGER,
    },
    uidvalidity: {
      type: DataTypes.INTEGER,
    },
    flags: {
      type: DataTypes.TEXT,
    },
    permFlags: {
      type: DataTypes.TEXT,
    },
    path: {
      type: DataTypes.STRING,
    },
    new: {
      type: DataTypes.INTEGER,
    },
    unseen: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Mailbox',
    tableName: 'mailboxes',
  }
)

Mailbox.belongsTo(EmailAccount, {
  foreignKey: 'emailAccountId',
  as: 'emailAccount',
})

module.exports = Mailbox
