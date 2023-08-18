const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

class Catalog extends Model {}

Catalog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(36),
      unique: true,
      index: true,
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      index: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Catalog',
  }
);

class Document extends Model {}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(36),
      unique: true,
      index: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING,
      index: true,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      index: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Document',
  }
);

module.export = { Catalog, Document };
