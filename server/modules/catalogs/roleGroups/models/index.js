const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class RoleGroup extends Model {}

RoleGroup.init(
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
    modelName: 'RoleGroup',
    tableName: 'role_groups',
    mainModel: true,
  }
)

module.exports = RoleGroup
