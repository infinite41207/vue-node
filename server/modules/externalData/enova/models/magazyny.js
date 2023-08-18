const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Magazyn = sequelize.define('enova_magazyn', {
  
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
  }
});

module.exports = Magazyn;
