const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Country extends Model {}

Country.init(
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
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alphaCode2: {
      type: DataTypes.STRING(2),
    },
    alphaCode3: {
      type: DataTypes.STRING(3),
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
    modelName: 'Country',
    tableName: 'countries',
    mainModel: true,
  }
)

module.exports = Country
