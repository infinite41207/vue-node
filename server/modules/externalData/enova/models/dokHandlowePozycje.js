const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Dokument = require('./dokHandlowe');
const Towar = require('./towary');

const PozycjaDokHandlowy = sequelize.define('enova_doc_handlowe_pozycja', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  kierunekMagazynu: {
    type: DataType.INTEGER,
  },
  lp: {
    type: DataType.INTEGER,
  },
  data: {
    type: DataType.DATE,
  },
  nazwa: {
    type: DataType.STRING,
  },
  cenaValue: {
    type: DataType.FLOAT,
  },
  cenaSymbol: {
    type: DataType.STRING,
  },
  iloscValue: {
    type: DataType.FLOAT,
  },
  iloscSymbol: {
    type: DataType.STRING,
  },
  wartoscCyValue: {
    type: DataType.FLOAT,
  },
  wartoscCySymbol: {
    type: DataType.STRING,
  },
  sumaNetto: {
    type: DataType.FLOAT,
  },
  sumaVAT: {
    type: DataType.FLOAT,
  },
  sumaBurtto: {
    type: DataType.FLOAT,
  },
});

PozycjaDokHandlowy.belongsTo(Dokument, {
  foreignKey: 'dokument',
  as: 'dokumentId',
});

PozycjaDokHandlowy.belongsTo(Towar, {
  foreignKey: 'towar',
  as: 'towarId',
});

module.exports = PozycjaDokHandlowy;