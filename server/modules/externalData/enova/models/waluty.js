const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Waluta = sequelize.define('enova_waluta', {
  
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

module.exports = Waluta;
