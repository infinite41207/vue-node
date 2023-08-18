const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const InteractionComment = require('./comment');

class InteractionCommentFile extends Model {}

InteractionCommentFile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
  },
  {
    sequelize,
    modelName: 'InteractionCommentFile',
    tableName: 'interaction_comment_files',
  }
);

InteractionComment.hasMany(InteractionCommentFile, {
  foreignKey: 'interactionCommentId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});
InteractionCommentFile.belongsTo(InteractionComment, {
  foreignKey: 'interactionCommentId',
  onDelete: 'cascade',
});

module.exports = InteractionCommentFile;
