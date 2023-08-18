const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const User = require('@catalogs/users/models');
const Interaction = require('.');

class InteractionComment extends Model {}

InteractionComment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    text: {
      type: DataTypes.TEXT,
    },
    byEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailAccountId: {
      type: DataTypes.UUID,
    },
    emailUid: {
      type: DataTypes.INTEGER,
    },
    emailId: {
      type: DataTypes.UUID,
    },
    emailTitle: {
      type: DataTypes.STRING,
    },
    emailType: {
      type: DataTypes.ENUM,
      values: ['INCOMING', 'OUTGOING'],
      defaultValue: 'INCOMING',
    },
  },
  {
    sequelize,
    modelName: 'InteractionComment',
    tableName: 'interaction_comments',
  }
);

InteractionComment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

InteractionComment.belongsTo(Interaction, {
  foreignKey: 'interactionId',
  as: 'interaction',
});

Interaction.hasMany(InteractionComment, {
  foreignKey: 'interactionId',
  as: 'comments',
  onDelete: 'cascade',
  hooks: true,
});

module.exports = InteractionComment;
