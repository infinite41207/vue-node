const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Towar = sequelize.define('enova_towar', {
  
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataType.STRING,
  },
  code: {
    type: DataType.STRING,
  }
});

module.exports = Towar;
