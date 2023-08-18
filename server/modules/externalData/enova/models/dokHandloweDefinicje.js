const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Definicja = sequelize.define('enova_definicja', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataType.STRING,
  },
  symbol: {
    type: DataType.STRING,
    allowNull: false,
  },
});

module.exports = Definicja;
