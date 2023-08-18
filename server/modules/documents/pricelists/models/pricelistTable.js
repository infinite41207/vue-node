const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Pricelist = require('./pricelist');

class PricelistTable extends Model {}

PricelistTable.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,

    },
    sortNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coordinateX: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coordinateY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minX: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxX: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PricelistTable',
    tableName: 'pricelist_tables',
    indexes: [
      {
        fields: ['pricelistId', 'minX', 'maxX', 'minY', 'maxY'],
      },
    ],
  }
);

Pricelist.hasMany(PricelistTable, {
  foreignKey: 'pricelistId',
  as: 'prices',
});

PricelistTable.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
});

module.exports = PricelistTable;
