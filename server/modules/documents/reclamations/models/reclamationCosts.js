const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Reclamation = require('./reclamation');
const CostArticles = require('@catalogs/costArticles/models');

class ReclamationCost extends Model {}

ReclamationCost.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationCost',
    tableName: 'reclamation_costs',
  }
);

ReclamationCost.belongsTo(CostArticles, {
  foreignKey: 'costArticleId',
  as: '_costArticle',
});

Reclamation.hasMany(ReclamationCost, {
  foreignKey: 'reclamationId',
  as: 'cost_reclamations',
  onDelete: 'cascade',
  hooks: true,
});
ReclamationCost.belongsTo(Reclamation, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

module.exports = ReclamationCost;
