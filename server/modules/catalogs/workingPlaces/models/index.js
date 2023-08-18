const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require('@enums')

const Scale = require('@catalogs/scales/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')

class WorkingPlace extends Model {}

WorkingPlace.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING(50),
    },
    computerName: {
      type: DataTypes.STRING(50),
    },
    control: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    networkPort: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numberOfCopies: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    orientation: {
      type: DataTypes.ENUM,
      values: Enums.ORIENTATION,
      allowNull: false,
    },
    pageSize: {
      type: DataTypes.STRING(10),
    },
    desibleWorkingInSeveralSessions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    raisingRailwayDisposition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isRollPrinter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    clientIdSerial: {
      type: DataTypes.TEXT,
    },
    desktopMode: {
      type: DataTypes.BOOLEAN,
    },
    desktopName: {
      type: DataTypes.STRING(150),
    },
    printerName: {
      type: DataTypes.STRING(50),
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
    modelName: 'WorkingPlace',
    tableName: 'working_places',
    mainModel: true,
  }
)
WorkingPlace.belongsTo(Scale, {
  foreignKey: 'scaleId',
  as: 'scale',
})
WorkingPlace.belongsTo(WeighingStation, {
  foreignKey: 'weighingStationId',
  as: 'weighingStation',
})
WorkingPlace.belongsTo(SchemeOfCargo, {
  foreignKey: 'dispositionsSchemeOfCargoId',
  as: 'dispositionsSchemeOfCargo',
})

module.exports = WorkingPlace
