const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Report = require('./index')
const ReportField = require('./fields')
const enums = require('@enums')

class ReportFunc extends Model {}

ReportFunc.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    use: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sequence: {
      type: DataTypes.INTEGER,
    },
    func: {
      type: enums.REPORT_FUNCS,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ReportFunc',
    tableName: 'report_func',
  }
)

ReportFunc.belongsTo(Report, {
  foreignKey: 'reportId',
  as: 'report',
  onDelete: 'cascade',
  hooks: true,
})

ReportFunc.belongsTo(ReportField, {
  foreignKey: 'reportFieldId',
  as: 'field',
  allowNull: false,
  onDelete: 'cascade',
  hooks: true,
})

Report.hasMany(ReportFunc, {
  foreignKey: 'reportId',
  as: 'funcs',
  onDelete: 'cascade',
  hooks: true,
})

module.exports = ReportFunc
