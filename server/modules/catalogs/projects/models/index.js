const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(500),
      unique: true,
      _fullSearch: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    progressValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    tasks: {
      type: DataTypes.INTEGER,
    },
    comments: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Finished', 'Ongoing'],
      allowNull: false,
      defaultValue: 'Ongoing',
      index: true,
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
    modelName: 'Project',
    tableName: 'projects',
    mainModel: true,
  }
)

module.exports = Project
