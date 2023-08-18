const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class DocumentPrefix extends Model {}

DocumentPrefix.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      index: true,
    },
    template: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'DocumentPrefix',
    tableName: 'doc_prefixes',
    mainModel: true,
  }
)

module.exports = DocumentPrefix
