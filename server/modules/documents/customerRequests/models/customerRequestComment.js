const { DataTypes, Model } = require('sequelize');
const sequelize = require('@database/dbConnection');

const User = require('@catalogs/users/models');
const CustomerRequest = require('./customerRequest');

class CustomerRequestComment extends Model {}

CustomerRequestComment.init(
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
    modelName: 'CustomerRequestComment',
    tableName: 'customer_request_comments',
  }
);

CustomerRequestComment.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

CustomerRequestComment.belongsTo(CustomerRequest, {
  foreignKey: 'customerRequestId',
  as: 'customerRequest',
});

CustomerRequest.hasMany(CustomerRequestComment, {
  foreignKey: 'customerRequestId',
  as: 'comments',
  onDelete: 'cascade',
  hooks: true,
});

module.exports = CustomerRequestComment;
