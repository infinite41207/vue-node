const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const DocumentPrefix = require('../models');

class PrefixDocumentType extends Model {}

PrefixDocumentType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PrefixDocumentType',
    tableName: 'prefix_doc_types',
  }
);

DocumentPrefix.hasMany(PrefixDocumentType, {
  foreignKey: 'documentPrefixId',
  as: 'documentTypes',
  onDelete: 'cascade',
  hooks: true,
});

PrefixDocumentType.belongsTo(DocumentPrefix, {
  foreignKey: 'documentPrefixId',
  onDelete: 'CASCADE',
});

module.exports = PrefixDocumentType;
