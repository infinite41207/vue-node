const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Reclamation = require('./reclamation');
const User = require('@catalogs/users/models');

class ReclamationHistory extends Model {}

ReclamationHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    actionDate: {
      type: DataTypes.DATE,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    actionId: {
      type: DataTypes.INTEGER,
    },
    recstatusFrom: {
      type: DataTypes.INTEGER,
    },
    recstatusTo: {
      type: DataTypes.INTEGER,
    },
    decision: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationHistory',
    tableName: 'reclamation_histories',
  }
);

Reclamation.hasMany(ReclamationHistory, {
  foreignKey: 'reclamationId',
  as: 'history_reclamations',
  onDelete: 'cascade',
  hooks: true,
});
ReclamationHistory.belongsTo(Reclamation, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

ReclamationHistory.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

module.exports = ReclamationHistory;
