const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const ParameterProperty = require('./parameterProperty');

class DependedPropertyDimension extends Model {}

DependedPropertyDimension.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    dimension: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    dimensionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sortNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    step: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'DependedPropertyDimension',
    tableName: 'depend_prop_dimensions',
  }
);

ParameterProperty.hasMany(DependedPropertyDimension, {
  foreignKey: 'propId',
});
DependedPropertyDimension.belongsTo(ParameterProperty, {
  foreignKey: 'propId',
});

module.exports = DependedPropertyDimension;
