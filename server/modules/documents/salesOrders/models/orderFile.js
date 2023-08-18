const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const SalesOrder = require('./order');

class SalesOrderFile extends Model {}

SalesOrderFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SalesOrderFile',
    tableName: 'order_files',
  }
);

SalesOrder.hasMany(SalesOrderFile, {
  foreignKey: 'orderId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});
SalesOrderFile.belongsTo(SalesOrder, {
  foreignKey: 'orderId',
  onDelete: 'cascade',
});

module.exports = SalesOrderFile;
