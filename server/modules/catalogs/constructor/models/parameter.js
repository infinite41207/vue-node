const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Product = require('@catalogs/products/models');

class Parameter extends Model {}

Parameter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    productUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
    },
    serialNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nextParamUuid: {
      type: DataTypes.STRING(36),
    },
    minValue: {
      type: DataTypes.STRING,
    },
    maxValue: {
      type: DataTypes.STRING,
    },
    codeName: {
      type: DataTypes.STRING(100),
    },
    filterDefault: {
      type: DataTypes.STRING(2000),
    },
    filter: {
      type: DataTypes.STRING(2000),
    },
    confirmDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasProperties: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasExpression: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasDepended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasRequared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasInformation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Parameter',
    tableName: 'product_params',
  }
);

Product.hasMany(Parameter, {
  foreignKey: 'productId',
});
Parameter.belongsTo(Product, {
  foreignKey: 'productId',
});

module.exports = Parameter;
