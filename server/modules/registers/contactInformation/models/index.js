const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const enums = require('@enums')

class ContactInformation extends Model {}
ContactInformation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    objectType: {
      type: DataTypes.STRING(50),
      allowNull: false, 
    },
    objectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    contactType: {
      type: DataTypes.ENUM,
      values: enums.CONTACT_TYPES,
      allowNull: false,
    },
    contactValue: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContactInformation',
    tableName: 'contact_information',
  }
)

module.exports = ContactInformation
