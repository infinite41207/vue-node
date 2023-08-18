const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Enums = require('@enums')
const UnitOfMeasure = require('@catalogs/unitsOfMeasure/models')

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
    sortNumber: {
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    article: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    configProduct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    imgUrl: {
      type: DataTypes.STRING(250),
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      allowNull: false,
      defaultValue: 'Active',
      index: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    baseSupplierRef: {
      type: DataTypes.STRING,
    },
    baseSupplier: {
      type: DataTypes.STRING,
    },
    itemSupplierArticle: {
      type: DataTypes.STRING,
    },
    store: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lang: {
      type: DataTypes.TEXT,
    },
    externalId: {
      type: DataTypes.STRING(50),
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.INVENTORY_TYPE,
      allowNull: false,
    },
    notUsedProductCondition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    distinguishFont: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    presentationColor: {
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
    modelName: 'Product',
    tableName: 'products',
    mainModel: true,
  }
)

Product.belongsTo(UnitOfMeasure, {
  foreignKey: 'unitOfMeasureId',
  as: 'unitOfMeasure',
})

module.exports = Product
