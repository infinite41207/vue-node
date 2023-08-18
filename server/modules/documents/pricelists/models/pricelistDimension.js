const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Pricelist = require('./pricelist');
const Parameter = require('@catalogs/constructor/models/parameter');

class PricelistDimension extends Model {}

PricelistDimension.init(
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
    dimensionUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PricelistDimension',
    tableName: 'pricelist_dimensions',
  }
);

Pricelist.hasMany(PricelistDimension, {
  foreignKey: 'pricelistId',
  as: 'dimensions',
});

PricelistDimension.belongsTo(Pricelist, {
  foreignKey: 'pricelistId',
});

PricelistDimension.belongsTo(Parameter, {
  foreignKey: 'dimensionId',
  as: 'dimension',
});

module.exports = PricelistDimension;
