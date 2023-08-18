const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Parameter = require('./parameter');

class ParameterValue extends Model {}

ParameterValue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sortNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rowUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    paramUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    nextParamUuid: {
      type: DataTypes.STRING(36),
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    descr: {
      type: DataTypes.STRING(300),
    },
    strNumber: {
      type: DataTypes.STRING(2),
    },
    messageDescr: {
      type: DataTypes.STRING(300),
    },
    filterDefault: {
      type: DataTypes.TEXT,
    },
    filter: {
      type: DataTypes.TEXT,
    },
    lang: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'ParameterValue',
    tableName: 'param_values',
  }
);

Parameter.hasMany(ParameterValue, {
  foreignKey: 'paramId',
});
ParameterValue.belongsTo(Parameter, {
  foreignKey: 'paramId',
});

module.exports = ParameterValue;
