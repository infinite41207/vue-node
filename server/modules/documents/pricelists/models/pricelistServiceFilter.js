const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Pricelist = require('./pricelist');

class PricelistServiceFilter extends Model {}

PricelistServiceFilter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PricelistServiceFilter',
    tableName: 'pricelist_service_filters',
  }
);

Pricelist.hasMany(PricelistServiceFilter, {
  foreignKey: 'pricelistId',
  as: 'service_filters',
});

PricelistServiceFilter.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
});

module.exports = PricelistServiceFilter;
