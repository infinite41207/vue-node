const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Report = require('./index')
const ReportField = require('./fields')
const enums = require('@enums')

class ReportFilter extends Model {}

ReportFilter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
    },
    sequence: {
      type: DataTypes.INTEGER,
    },
    use: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    operator: {
      type: enums.REPORT_OPERATORS,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name ? this.name : this.field?.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'ReportFilter',
    tableName: 'report_filter',
  }
)

ReportFilter.belongsTo(Report, {
  foreignKey: 'reportId',
  as: 'report',
  onDelete: 'cascade',
  hooks: true,
})

ReportFilter.belongsTo(ReportField, {
  foreignKey: 'reportFieldId',
  as: 'field',
  allowNull: false,
  onDelete: 'cascade',
  hooks: true,
})

Report.hasMany(ReportFilter, {
  foreignKey: 'reportId',
  as: 'filters',
  onDelete: 'cascade',
  hooks: true,
})

module.exports = ReportFilter
