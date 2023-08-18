const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const Customer = require('@catalogs/counterparties/models')
const Employee = require('@catalogs/employees/models')
const User = require('@catalogs/users/models')
const InteractionStatus = require('@catalogs/interactionStatuses/models')

class Interaction extends Model {}

Interaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    versionUuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      index: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      index: true,
    },
    state: {
      type: DataTypes.ENUM,
      values: ['Active', 'Deactive'],
      allowNull: false,
      defaultValue: 'Active',
      index: true,
    },
    numberStr: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    prefix: {
      type: DataTypes.STRING(4),
      allowNull: false,
      index: true,
    },
    reference: {
      type: DataTypes.STRING(150),
    },
    date: {
      type: DataTypes.DATE,
    },
    ordered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    executionTerm: {
      type: DataTypes.DATE,
    },
    tags: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.numberStr
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Interaction',
    tableName: 'interactions',
    mainModel: true,
  }
)

Interaction.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
})

Interaction.belongsTo(Employee, {
  foreignKey: 'managerId',
  as: 'manager',
})

Interaction.belongsTo(User, {
  foreignKey: 'executorId',
  as: 'executor',
})

Interaction.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

Interaction.belongsTo(InteractionStatus, {
  foreignKey: 'statusId',
  as: 'status',
})

module.exports = Interaction
