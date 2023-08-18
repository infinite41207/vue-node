const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Waluty = require('./waluty');

const Kurs = sequelize.define('enova_kursy_walut', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  data: {
    type: DataType.DATE,
  },
  krotnosc: {
    type: DataType.INTEGER,
  },
  kurs: {
    type: DataType.FLOAT,
  },
  kurs_zakupu: {
    type: DataType.FLOAT,
  },
  numer_tabeli: {
    type: DataType.STRING,
  },
});

Kurs.belongsTo(Waluty, {
  foreignKey: 'waluta',
  as: 'walutaId',
});

module.exports = Kurs;
