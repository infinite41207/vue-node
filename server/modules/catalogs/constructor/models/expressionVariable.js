const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Product = require('@catalogs/products/models');

class ExpressionVariable extends Model {}

ExpressionVariable.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ExpressionVariable',
    tableName: 'expression_variables',
    indexes: [
      {
        unique: true,
        fields: ['productId', 'name'],
      },
    ],
  }
);

Product.hasMany(ExpressionVariable, {
  foreignKey: 'productId',
});
ExpressionVariable.belongsTo(Product, {
  foreignKey: 'productId',
});

module.exports = ExpressionVariable;
