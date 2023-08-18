const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class DispositionStatus extends Model {}
DispositionStatus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
    },
    lang: {
      type: DataTypes.STRING(9),
    },
    key: {
      type: DataTypes.STRING(50),
      index: true,
    },
  },
  {
    sequelize,
    modelName: 'DispositionStatus',
    tableName: 'disp_statuses',
    mainModel: true,
  }
)

module.exports = DispositionStatus
