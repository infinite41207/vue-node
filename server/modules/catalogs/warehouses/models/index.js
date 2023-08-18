const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

class Warehouse extends Model {}
Warehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
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
    externalId: {
      type: DataTypes.STRING(20),
    },
    notes: {
      type: DataTypes.STRING,
    },
    capasity: {
      type: DataTypes.DECIMAL(15, 3),
    },
    reflect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    initDate: {
      type: DataTypes.DATE,
    },
    carsBuffer: {
      type: DataTypes.INTEGER,
    },
    queueOn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
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
    modelName: 'Warehouse',
    tableName: 'warehouses',
    mainModel: true,
  }
)

module.exports = Warehouse
