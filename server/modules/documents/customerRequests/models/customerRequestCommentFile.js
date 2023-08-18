const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const CustomerRequestComment = require('./customerRequestComment');

class CustomerRequestCommentFile extends Model {}

CustomerRequestCommentFile.init(
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
  },
  {
    sequelize,
    modelName: 'CustomerRequestCommentFile',
    tableName: 'cr_comment_files',
  }
);

CustomerRequestComment.hasMany(CustomerRequestCommentFile, {
  foreignKey: 'cRCommentId',
  as: 'files',
  onDelete: 'cascade',
  hooks: true,
});
CustomerRequestCommentFile.belongsTo(CustomerRequestComment, {
  foreignKey: 'cRCommentId',
  onDelete: 'cascade',
});

module.exports = CustomerRequestCommentFile;
