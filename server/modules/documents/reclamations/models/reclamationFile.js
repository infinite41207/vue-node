const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Reclamation = require('./reclamation');

class ReclamationFile extends Model {}

ReclamationFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
    },

    hasProtocol: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationFile',
    tableName: 'reclamation_files',
  }
);

Reclamation.hasMany(ReclamationFile, {
  foreignKey: 'reclamationId',
  as: 'reclamationFiles',
  onDelete: 'cascade',
  hooks: true,
});

ReclamationFile.belongsTo(Reclamation, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

module.exports = ReclamationFile;
