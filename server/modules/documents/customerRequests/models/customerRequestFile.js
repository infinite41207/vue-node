const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const CustomerRequest = require('./customerRequest');

class CustomerRequestFile extends Model {}

CustomerRequestFile.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fileDestination: {
      type: DataTypes.ENUM,
      values: ['FOR_CUSTOMER', 'FROM_CUSTOMER', 'CALCULATION', 'OTHER'],
      allowNull: true,
      defaultValue: 'OTHER',
    },
  },
  {
    sequelize,
    modelName: 'CustomerRequestFile',
    tableName: 'customer_request_files',
  }
);

CustomerRequest.hasMany(CustomerRequestFile, {
  foreignKey: 'customerRequestId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});
CustomerRequestFile.belongsTo(CustomerRequest, {
  foreignKey: 'customerRequestId',
  onDelete: 'cascade',
});

module.exports = CustomerRequestFile;
