const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Report extends Model {}

Report.init(
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
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    periodType: {
      type: DataTypes.ENUM,
      values: ['date', 'period'],
      defaultValue: 'date',
    },
    date: {
      type: DataTypes.DATE,
    },
    dateFrom: {
      type: DataTypes.DATE,
    },
    dateTo: {
      type: DataTypes.DATE,
    },
    showYTotal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    showXTotal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dataQuery: {
      type: DataTypes.TEXT,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Report',
    tableName: 'reports',
  }
)

module.exports = Report
