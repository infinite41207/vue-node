const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const ParameterProperty = require('./parameterProperty');

class DependedPropertyValue extends Model {}

DependedPropertyValue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    propUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    coordinateX: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    coordinateY: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    coordinateZ: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    propValue: {
      type: DataTypes.DECIMAL(15, 2),
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
    minZ: {
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
    maxZ: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'DependedPropertyValue',
    tableName: 'depend_prop_values',
    indexes: [
      {
        unique: true,
        fields: ['propId', 'coordinateX', 'coordinateY', 'coordinateZ', 'minX', 'minY', 'minZ', 'maxX', 'maxY', 'maxZ'],
      },
    ],
  }
);

ParameterProperty.hasMany(DependedPropertyValue, {
  foreignKey: 'propId',
});
DependedPropertyValue.belongsTo(ParameterProperty, {
  foreignKey: 'propId',
});

module.exports = DependedPropertyValue;
