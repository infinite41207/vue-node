const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Warehouse = require('@catalogs/warehouses/models')

class Box extends Model {}
Box.init(
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
    externalId: {
      type: DataTypes.STRING(20),
    },
    registrAdress: {
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
    modelName: 'Box',
    tableName: 'boxes',
    mainModel: true,
  }
)

Box.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse',
})

module.exports = Box
