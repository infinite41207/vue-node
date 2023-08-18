const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const ParameterProperty = require('./parameterProperty');

class PropertyValue extends Model {}

PropertyValue.init(
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
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'PropertyValue',
    tableName: 'prop_values',
  }
);

ParameterProperty.hasMany(PropertyValue, {
  foreignKey: 'propId',
  as: 'values',
});
PropertyValue.belongsTo(ParameterProperty, {
  foreignKey: 'propId',
});

module.exports = PropertyValue;
