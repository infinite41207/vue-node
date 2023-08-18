const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class DocumentNumerator extends Model {}

DocumentNumerator.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    docType: {
      type: DataTypes.INTEGER,
    },
    numerator: {
      type: DataTypes.INTEGER,
    },
    numeratorValue: {
      type: DataTypes.STRING,
    },
    yearNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    lastNumber: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'DocumentNumerator',
    tableName: 'doc_numerators',
    mainModel: true,
  }
)

module.exports = DocumentNumerator
