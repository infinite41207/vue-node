const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Kontrahent = sequelize.define('enova_kontrahent', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataType.TEXT,
  },
  NIP: {
    type: DataType.STRING(20),
  },
  PodatnikVAT: {
    type: DataType.INTEGER,
  },
  EuVAT: {
    type: DataType.STRING,
  },
});

module.exports = Kontrahent;
