const { DataTypes, Model } = require("sequelize");
const sequelize = require("@database/dbConnection");

const Enums = require("@enums");

const Currency = require('@catalogs/currencies/models')

class PaymentType extends Model {}

PaymentType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(500),
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    markedToDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Finished", "Ongoing"],
      allowNull: false,
      defaultValue: "Ongoing",
      index: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_PAYMENT,
      allowNull: false,
      defaultValue: "Cash",
      index: true,
    },
    presentation: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.name;
      },
      set(value) {
        throw new Error("Do not try to set the `presentation` value!");
      },
    },
  },
  {
    sequelize,
    modelName: "PaymentType",
    tableName: "payment_types",
  }
);

PaymentType.belongsTo(Currency, {
  foreignKey: 'currencyId',
  as: 'currency',
})

module.exports = PaymentType;
