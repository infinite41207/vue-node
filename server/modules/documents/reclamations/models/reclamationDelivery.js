const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Reclamation = require('./reclamation');
const DeliveryTypes = require('@catalogs/deliveryTypes/models');

class ReclamationDelivery extends Model {}

ReclamationDelivery.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Przygotowane', 'Wysłane'],
      allowNull: false,
      defaultValue: 'Przygotowane',
      index: true,
    },
    deliveryDate: {
      type: DataTypes.DATE,
    },
    deliveryNote: {
      type: DataTypes.STRING,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
    },
    items: {
      type: DataTypes.TEXT,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  },

  {
    sequelize,
    modelName: 'ReclamationDelivery',
    tableName: 'reclamation_deliveries',
  }
);

Reclamation.hasMany(ReclamationDelivery, {
  foreignKey: 'reclamationId',
  as: 'delivery_reclamations',
  onDelete: 'cascade',
  hooks: true,
});
ReclamationDelivery.belongsTo(Reclamation, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

ReclamationDelivery.belongsTo(DeliveryTypes, {
  foreignKey: 'delivery_type',
  as: '_deliveryType',
});

module.exports = ReclamationDelivery;
