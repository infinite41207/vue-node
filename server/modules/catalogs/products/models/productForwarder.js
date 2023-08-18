const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Product = require('@catalogs/products/models');
const Forwarder = require('@catalogs/vendorsAndCustomers/models');

class ProductForwarder extends Model {}

ProductForwarder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductForwarder',
    tableName: 'product_forwarders',
}
);

Product.hasMany(ProductForwarder, {
  foreignKey: 'productId',
  as: 'forwarders',
  onDelete: 'cascade',
  hooks: true,
});

ProductForwarder.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

ProductForwarder.belongsTo(Forwarder, {
  foreignKey: 'forwarderId',
  as: 'forwarder',
});

module.exports = ProductForwarder;