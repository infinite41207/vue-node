
const sequelize = require('@database/dbConnection');
const DataType = require('sequelize');

const User = require('@catalogs/users/models');

const ReportVariant = sequelize.define(
  'report_variant',
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    reportName: {
      type: DataType.STRING,
      allowNull: false,
      index: true,
    },
    variantName: {
      type: DataType.STRING,
      allowNull: false,
      index: true,
    },
    settings: {
      type: DataType.TEXT,
    },
  },
  {}
);

ReportVariant.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = ReportVariant;
