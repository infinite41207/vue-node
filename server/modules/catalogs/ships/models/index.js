const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Ship extends Model {}

Ship.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      _fullSearch: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(9),
    },
    comment: {
      type: DataTypes.STRING(20),
    },
    imo: {
      type: DataTypes.STRING(7),
    },
    length: {
      type: DataTypes.INTEGER,
    },
    number: {
      type: DataTypes.STRING(10),
    },
    width: {
      type: DataTypes.INTEGER,
    },
    externalId: {
      type: DataTypes.STRING(10),
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
    modelName: 'Ship',
    tableName: 'ships',
    mainModel: true,
  }
)

module.exports = Ship
