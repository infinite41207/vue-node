const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class AccessRestriction extends Model {}

AccessRestriction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    objectType: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      index: true,
    },
    useRestriction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    useDepartmentRestriction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'AccessRestriction',
    tableName: 'access_restrictions',
  }
)

module.exports = AccessRestriction
