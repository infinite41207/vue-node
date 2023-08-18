const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Report = require('./index')
const ReportField = require('./fields')

class ReportGroup extends Model {}

ReportGroup.init(
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
    name: {
      type: DataTypes.STRING(150),
    },
    sequence: {
      type: DataTypes.INTEGER,
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
    modelName: 'ReportGroup',
    tableName: 'report_group',
  }
)

ReportGroup.belongsTo(Report, {
  foreignKey: 'reportId',
  as: 'report',
  onDelete: 'cascade',
  hooks: true,
})

ReportGroup.belongsTo(ReportField, {
  foreignKey: 'reportFieldId',
  as: 'field',
  allowNull: false,
  onDelete: 'cascade',
  hooks: true,
})

Report.hasMany(ReportGroup, {
  foreignKey: 'reportId',
  as: 'groups',
  onDelete: 'cascade',
  hooks: true,
})

module.exports = ReportGroup
