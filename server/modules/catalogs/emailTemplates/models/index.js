const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class EmailTemplate extends Model {}

EmailTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    baseDocument: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cc: {
      type: DataTypes.TEXT,
    },
    bcc: {
      type: DataTypes.TEXT,
    },
    executionCondition: {
      type: DataTypes.TEXT,
    },
    recepientsCondition: {
      type: DataTypes.TEXT,
    },
    contentVariantsList: {
      type: DataTypes.TEXT,
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
    modelName: 'EmailTemplate',
    tableName: 'email_templates',
    mainModel: true,
  }
)

module.exports = EmailTemplate
