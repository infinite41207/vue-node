const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const ReclamationDoc = require('./reclamation')
const ReclamationSubject = require('@catalogs/reclamationSubjects/models')
const ReclamationExecutionType = require('@catalogs/reclamationExecutionTypes/models')
const ReclamationDecision = require('@catalogs/reclamationDecisions/models')
const ReclamationReason = require('@catalogs/reclamationReasons/models')
const ReclamationPerpetrator = require('@catalogs/reclamationPerpetrator/models')
const ReclamationClientDemand = require('@catalogs/reclamationClientDemands/models')

class ReclamationItem extends Model {}

ReclamationItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    possitionWh: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    kwatera: {
      type: DataTypes.STRING,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    erpPossitions: {
      type: DataTypes.TEXT,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationItem',
    tableName: 'reclamation_items',
  }
)

ReclamationDoc.hasMany(ReclamationItem, {
  foreignKey: 'reclamationId',
  as: 'reclamation_items',
  onDelete: 'cascade',
  hooks: true,
})
ReclamationItem.belongsTo(ReclamationDoc, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
})

ReclamationItem.belongsTo(ReclamationSubject, {
  foreignKey: 'reclamationSubjectId',
  as: '_reclamationSubject',
})
ReclamationItem.belongsTo(ReclamationExecutionType, {
  foreignKey: 'executionTypeId',
  as: '_reclamationExecutionType',
})
ReclamationItem.belongsTo(ReclamationDecision, {
  foreignKey: 'reclamationDecisionId',
  as: '_reclamationDecision',
})

ReclamationItem.belongsTo(ReclamationPerpetrator, {
  foreignKey: 'reclamationPerpetratorId',
  as: '_perpetrator',
})

ReclamationItem.belongsTo(ReclamationReason, {
  foreignKey: 'reclamationReasonId',
  as: '_reclamationReason',
})

ReclamationItem.belongsTo(ReclamationClientDemand, {
  foreignKey: 'reclamationClientDemandId',
  as: '_clientDemand',
})

module.exports = ReclamationItem
