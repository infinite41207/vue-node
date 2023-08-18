const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const ReclamationDoc = require('./reclamation');

class ReclamationProductionOrder extends Model {}

ReclamationProductionOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    executionDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationProductionOrder',
    tableName: 'reclamation_productionorders',
  }
);

ReclamationDoc.hasMany(ReclamationProductionOrder, {
  foreignKey: 'reclamationId',
  as: 'prodorder_reclamations',
  onDelete: 'cascade',
  hooks: true,
});
ReclamationProductionOrder.belongsTo(ReclamationDoc, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

module.exports = ReclamationProductionOrder;
