const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Report = require('./index')
const enums = require('@enums')

class ReportField extends Model {}

ReportField.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      index: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
    },
    property: {
      type: DataTypes.STRING(150),
    },
    title: {
      type: DataTypes.STRING(150),
    },
    valueType: {
      type: DataTypes.ENUM,
      values: enums.DATA_TYPES,
    },
    objectType: {
      type: DataTypes.STRING(100),
    },
    format: {
      type: DataTypes.STRING(150),
    },
    styles: {
      type: DataTypes.TEXT,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    filterable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    groupable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    filterDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    groupDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dataRef: {
      type: DataTypes.STRING(150),
    },
    width: {
      type: DataTypes.NUMBER,
      defaultValue: 5,
    },
    markedToDelete: {
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
    modelName: 'ReportField',
    tableName: 'report_fields',
  }
)

ReportField.belongsTo(Report, {
  foreignKey: 'reportId',
  as: 'report',
  onDelete: 'cascade',
  hooks: true,
})

Report.hasMany(ReportField, {
  foreignKey: 'reportId',
  as: 'fields',
  onDelete: 'cascade',
  hooks: true,
})

module.exports = ReportField
