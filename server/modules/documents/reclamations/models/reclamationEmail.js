const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Reclamation = require('./reclamation');
const ReclamationStatus = require('@catalogs/reclamationStatuses/models');

class ReclamationEmail extends Model {}

ReclamationEmail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['INCOMING', 'OUTGOING'],
    },
    uid: {
      type: DataTypes.INTEGER,
    },
    emailId: {
      type: DataTypes.INTEGER,
    },
    accountId: {
      type: DataTypes.INTEGER,
    },
    emailDate: {
      type: DataTypes.DATE,
    },
    from: {
      type: DataTypes.STRING,
    },
    to: {
      type: DataTypes.STRING,
    },
    cc: {
      type: DataTypes.STRING,
    },
    tittle: {
      type: DataTypes.STRING,
    },
    emailText: {
      type: DataTypes.TEXT,
    },
    action: {
      type: DataTypes.INTEGER,
    },
    emailTplId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    sent: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'ReclamationEmail',
    tableName: 'reclamation_emails',
  }
);

Reclamation.hasMany(ReclamationEmail, {
  foreignKey: 'reclamationId',
  as: 'email_reclamations',
  onDelete: 'cascade',
  hooks: true,
});
ReclamationEmail.belongsTo(Reclamation, {
  foreignKey: 'reclamationId',
  onDelete: 'cascade',
});

ReclamationEmail.belongsTo(ReclamationStatus, {
  foreignKey: 'reclamationStatusId',
  as: '_reclamation_status',
});

module.exports = ReclamationEmail;
