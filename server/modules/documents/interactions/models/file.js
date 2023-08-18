const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const Interaction = require('.');

class InteractionFile extends Model {}

InteractionFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'InteractionFile',
    tableName: 'interaction_files',
  }
);

Interaction.hasMany(InteractionFile, {
  foreignKey: 'interactionId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});
InteractionFile.belongsTo(Interaction, {
  foreignKey: 'interactionId',
  onDelete: 'cascade',
});

module.exports = InteractionFile;
