const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const StatusGroup = require('@catalogs/reclamationStatusGroups/models')

class ReclamationStatus extends Model {}

ReclamationStatus.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    adminAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    userAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    oracleId: {
      type: DataTypes.STRING,
    },

    code1C: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.description
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'ReclamationStatus',
    tableName: 'reclamation_statuses',
    mainModel: true,
  }
)

ReclamationStatus.belongsTo(StatusGroup, {
  foreignKey: 'statusgroupid',
  as: 'statusgroup',
})

module.exports = ReclamationStatus
