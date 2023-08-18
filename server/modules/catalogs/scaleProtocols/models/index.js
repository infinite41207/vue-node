const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Enums = require('@enums')

class ScaleProtocol extends Model {}

ScaleProtocol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      index: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.PROTOCOL_SCALE,
    },
    server: {
      type: DataTypes.STRING(20),
    },
    port: {
      type: DataTypes.INTEGER,
    },
    api: {
      type: DataTypes.STRING(50),
    },
    command: {
      type: DataTypes.STRING(20),
    },
    register: {
      type: DataTypes.INTEGER,
    },
    serialPort: {
      type: DataTypes.STRING(20),
    },
    parserType: {
      type: DataTypes.ENUM,
      values: Enums.PROTOCOL_SCALE_PARSE,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'ScaleProtocol',
    tableName: 'scale_protocols',
    mainModel: true,
  }
)

module.exports = ScaleProtocol
