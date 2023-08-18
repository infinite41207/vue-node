const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const Definicja = require('./dokHandloweDefinicje');
const Magazyn = require('./magazyny');
const Kontrahent = require('./kontrahenci');
const Odbiorca = require('./kontrahenci');

const DocHandlowy = sequelize.define('enova_doc_handlowy', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  stan: {
    type: DataType.INTEGER,
  },
  potwierdzenie: {
    type: DataType.INTEGER,
  },
  kierunekMagazynu: {
    type: DataType.INTEGER,
  },
  numerPelny: {
    type: DataType.STRING,
  },
  data: {
    type: DataType.DATE,
  },
  dataOperacji: {
    type: DataType.DATE,
  },
  sumaNetto: {
    type: DataType.FLOAT,
  },
  sumaVAT: {
    type: DataType.FLOAT,
  },
  sumaBrutto: {
    type: DataType.FLOAT,
  },
  dataKursu: {
    type: DataType.DATE,
  },
  kursWaluty: {
    type: DataType.FLOAT,
  },

  bruttoCyValue: {
    type: DataType.FLOAT,
  },
  bruttoCySymbol: {
    type: DataType.STRING,
  },
  opis: {
    type: DataType.STRING,
  },

});

DocHandlowy.belongsTo(Definicja, {
  foreignKey: 'definicja',
  as: 'definicjaId',
});

DocHandlowy.belongsTo(Magazyn, {
  foreignKey: 'magazyn',
  as: 'magazynid',
});

DocHandlowy.belongsTo(Kontrahent, {
  foreignKey: 'kontrahent',
  as: 'kontrahentId',
});

DocHandlowy.belongsTo(Odbiorca, {
  foreignKey: 'odbiorca',
  as: 'odbiorcaId',
});

module.exports = DocHandlowy;
