const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')

class SchemeOfCargoExternalCode extends Model {}

SchemeOfCargoExternalCode.init(
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    externalCode: {
        type: DataTypes.STRING(20),
    },
  },
  {
    sequelize,
    modelName: 'SchemeOfCargoExternalCode',
    tableName: 'schemes_of_cargo_external_codes',
}
);

Product.hasMany(SchemeOfCargoExternalCode, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
  onDelete: 'cascade',
  hooks: true,
});

ProductForwarder.belongsTo(SchemeOfCargo, {
  foreignKey: 'schemeOfCargoId',
  as: 'schemeOfCargo',
});

module.exports = SchemeOfCargoExternalCode;