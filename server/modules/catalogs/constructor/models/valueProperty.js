const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const ParameterValue = require('./parameterValue');
const ParameterProperty = require('./parameterProperty');

class ValueProperty extends Model {}

ValueProperty.init(
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
    valueUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    propUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    propValueUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    propValue: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fillingRequires: {
      type: DataTypes.BOOLEAN,
    },
    checkList: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'ValueProperty',
    tableName: 'value_props',
  }
);

ParameterValue.hasMany(ValueProperty, {
  foreignKey: 'valueId',
  as: 'properties',
});
ValueProperty.belongsTo(ParameterValue, {
  foreignKey: 'valueId',
});
ValueProperty.belongsTo(ParameterProperty, {
  foreignKey: 'propId',
  as: 'property',
});

module.exports = ValueProperty;
