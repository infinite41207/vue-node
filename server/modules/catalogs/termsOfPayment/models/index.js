const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class TermOfPayment extends Model {}

TermOfPayment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      index: true,
      _fullSearch: true,
    },
    days: {
      type: DataTypes.INTEGER,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'TermOfPayment',
    tableName: 'terms_of_payment',
    mainModel: true,
  }
)

module.exports = TermOfPayment
