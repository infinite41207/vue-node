const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')
const Enums = require('@enums')

const WeighingStation = require('@catalogs/weighingStations/models')
const ScaleProtocol = require('@catalogs/scaleProtocols/models')

class Scale extends Model {}

Scale.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(9),
    },
    barCodePrefix: {
      type: DataTypes.STRING(10),
    },
    scalesNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    scalesVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    updatePeriod: {
      type: DataTypes.INTEGER,
      default: 0,
    },
    scalesType: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_SCALE,
      allowNull: false,
    },
    typeOfDocument: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_DOCUMENT,
      allowNull: false,
    },
    factor: {
      type: DataTypes.DECIMAL(15, 3),
    },
    deviation: {
      type: DataTypes.DECIMAL(15, 3),
    },
    iot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gatewayServer: {
      type: DataTypes.STRING(20),
    },
    gatewayPort: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gatewayLogin: {
      type: DataTypes.STRING(100),
    },
    gatewayPassword: {
      type: DataTypes.STRING(100),
    },
    gatewayResource: {
      type: DataTypes.STRING(200),
    },
    useVideoRecorder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    videoRecorderUser: {
      type: DataTypes.STRING(20),
    },
    videoRecorderPassword: {
      type: DataTypes.STRING(20),
    },
    videoRecorderServer: {
      type: DataTypes.STRING(50),
    },
    videoRecorderPort: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    videoRecorderRequest: {
      type: DataTypes.STRING(255),
    },
    videoRecorderPathToFile: {
      type: DataTypes.STRING(255),
    },
    protocolType: {
      type: DataTypes.ENUM,
      values: Enums.PROTOCOL_SCALE,
    },
    tcpIp: {
      type: DataTypes.STRING(20),
    },
    tcpPort: {
      type: DataTypes.INTEGER,
    },
    scaleCom: {
      type: DataTypes.STRING(10),
    },
    blockSelfServiceInterface: {
      type: DataTypes.BOOLEAN,
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
    modelName: 'Scale',
    tableName: 'scales',
    mainModel: true,
  }
)

Scale.belongsTo(ScaleProtocol, {
  foreignKey: 'scaleProtocolId',
  as: 'scaleProtocol',
})

Scale.belongsTo(WeighingStation, {
  foreignKey: 'weighingStationId',
  as: 'weighingStation',
})

module.exports = Scale
