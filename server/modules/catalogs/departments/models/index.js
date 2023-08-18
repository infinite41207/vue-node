const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const User = require('@catalogs/users/models')

class Department extends Model {}
Department.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'Department',
    tableName: 'departments',
    mainModel: true,
  }
)

Department.belongsTo(User, {
  foreignKey: 'leaderId',
  as: 'leader',
})

Department.belongsTo(User, {
  foreignKey: 'deputyId',
  as: 'deputy',
})

module.exports = Department
