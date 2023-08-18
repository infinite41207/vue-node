const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Parameter = require('./parameter');

class ParameterProperty extends Model {}

ParameterProperty.init(
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
    paramUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    dataType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    codeName: {
      type: DataTypes.STRING(100),
    },
    expression: {
      type: DataTypes.TEXT,
    },
    fillingRequires: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fillFrom: {
      type: DataTypes.STRING(50),
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    depended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    information: {
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
    modelName: 'ParameterProperty',
    tableName: 'param_props',
  }
);

Parameter.hasMany(ParameterProperty, {
  foreignKey: 'paramId',
});
ParameterProperty.belongsTo(Parameter, {
  foreignKey: 'paramId',
});

module.exports = ParameterProperty;
