const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class EmailAccount extends Model {}

EmailAccount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    isGeneral: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user: {
      type: DataTypes.STRING(150),
    },
    password: {
      type: DataTypes.STRING,
    },
    imapHost: {
      type: DataTypes.STRING,
    },
    imapPort: {
      type: DataTypes.INTEGER,
    },
    imapTls: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    smtpTls: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    smtpHost: {
      type: DataTypes.STRING,
    },
    smtpPort: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    forSend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    forReceive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    storeReceived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    storeSended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    storeFilesToHardDrive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isService: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    signatures: {
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
    modelName: 'EmailAccount',
    tableName: 'email_accounts',
    mainModel: true,
  }
)

EmailAccount.prototype.toJSON = function () {
  const values = Object.assign({}, this.get())
  delete values.password
  return values
}

module.exports = EmailAccount
