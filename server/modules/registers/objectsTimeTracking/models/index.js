const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class ObjectTimeTracking extends Model {}
ObjectTimeTracking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    objectType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ObjectTimeTracking',
    tableName: 'objects_time_tracking',
    mainModel: true,
  }
)

module.exports = ObjectTimeTracking
