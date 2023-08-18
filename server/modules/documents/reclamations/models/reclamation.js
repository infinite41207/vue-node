const { DataTypes, Model } = require('sequelize')
const sequelize = require('@database/dbConnection')

const ReclamationType = require('@catalogs/reclamationTypes/models')
const Customer = require('@catalogs/counterparties/models')
const ExecutionType = require('@catalogs/reclamationExecutionTypes/models')
const Decision = require('@catalogs/reclamationDecisions/models')
const Status = require('@catalogs/reclamationStatuses/models')
const Users = require('@catalogs/users/models')
const ReclamationReason = require('@catalogs/reclamationReasons/models')
const ReclamationPerpetrator = require('@catalogs/reclamationPerpetrator/models')
const Employee = require('@catalogs/employees/models')
const DeliveryTypes = require('@catalogs/deliveryTypes/models')

class Reclamation extends Model {}

Reclamation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
    },
    inputDate: {
      type: DataTypes.DATE,
    },
    salesDate: {
      type: DataTypes.DATE,
    },
    decisionDate: {
      type: DataTypes.DATE,
    },
    salesOrder: {
      type: DataTypes.STRING,
    },
    salesReference: {
      type: DataTypes.STRING,
    },
    salesRequest: {
      type: DataTypes.STRING,
    },
    docGroup: {
      type: DataTypes.STRING,
    },
    executionDate: {
      type: DataTypes.DATE,
    },
    executionTerm: {
      type: DataTypes.DATE,
    },
    executionDays: {
      type: DataTypes.INTEGER,
    },
    deliveryTerm: {
      type: DataTypes.DATE,
    },

    salesPoint: {
      type: DataTypes.INTEGER,
    },

    guarantyCard: {
      type: DataTypes.BOOLEAN,
    },
    invAddress: {
      type: DataTypes.BOOLEAN,
    },
    clientName: {
      type: DataTypes.STRING,
    },
    clientSurname: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    postCode: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    postCodeInv: {
      type: DataTypes.STRING,
    },
    cityInv: {
      type: DataTypes.STRING,
    },
    addressInv: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    internalComment: {
      type: DataTypes.TEXT,
    },
    lw: {
      type: DataTypes.STRING,
    },
    zlc: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    possitionsDescription: {
      type: DataTypes.TEXT,
    },
    oracleId: {
      type: DataTypes.INTEGER,
    },
    sendemail: {
      type: DataTypes.STRING,
    },
    viewId: {
      type: DataTypes.INTEGER,
    },
    numNumber: {
      type: DataTypes.INTEGER,
    },
    recstatusDate: {
      type: DataTypes.DATE,
    },
    recacceptdate: {
      type: DataTypes.DATE,
    },
    recstatusDescription: {
      type: DataTypes.TEXT,
    },
    recstatusDateEndCount: {
      type: DataTypes.DATE,
    },
    reclNew: {
      type: DataTypes.INTEGER,
    },
    decisionDescription: {
      type: DataTypes.TEXT,
    },
    agreementMaxWh: {
      type: DataTypes.INTEGER,
    },
    reclPrinted: {
      type: DataTypes.BOOLEAN,
    },
    deliveryPaymentSide: {
      type: DataTypes.ENUM,
      values: ['Fabryka', 'Handlowiec', 'Klient'],
    },
    deliveryStatus: {
      type: DataTypes.ENUM,
      values: ['Przygotowane', 'Wysłane'],
    },
    deliveryDate: {
      type: DataTypes.DATE,
    },
    deliveryNote: {
      type: DataTypes.STRING,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
    },
    deliveryItems: {
      type: DataTypes.TEXT,
    },
    deliveryComment: {
      type: DataTypes.TEXT,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.number
      },
      set(value) {
        throw new Error('Do not try to set the `presentation` value!')
      },
    },
  },
  {
    sequelize,
    modelName: 'Reclamation',
    tableName: 'reclamations',
    mainModel: true,
  }
)

Reclamation.belongsTo(DeliveryTypes, {
  foreignKey: 'deliveryTypeId',
  as: '_deliveryType',
})

Reclamation.belongsTo(ReclamationType, {
  foreignKey: 'docTypeId',
  as: 'docType',
})

Reclamation.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: '_customer',
})

Reclamation.belongsTo(ExecutionType, {
  foreignKey: 'executionTypeId',
  as: '_execution_type',
})

Reclamation.belongsTo(Decision, {
  foreignKey: 'decisionId',
  as: '_decision',
})

Reclamation.belongsTo(Status, {
  foreignKey: 'statusId',
  as: '_status',
})

Reclamation.belongsTo(Users, {
  foreignKey: 'authorId',
  as: '_author',
})

Reclamation.belongsTo(Users, {
  foreignKey: 'responsibleId',
  as: '_responsible',
})

Reclamation.belongsTo(ReclamationPerpetrator, {
  foreignKey: 'perpetratorId',
  as: '_perpetrator',
})

Reclamation.belongsTo(ReclamationReason, {
  foreignKey: 'reclamationReasonId',
  as: '_reclamationReason',
})

Reclamation.belongsTo(Employee, {
  foreignKey: 'managerId',
  as: 'manager',
})

Reclamation.belongsTo(Users, {
  foreignKey: 'executorId',
  as: '_executor',
})

module.exports = Reclamation
