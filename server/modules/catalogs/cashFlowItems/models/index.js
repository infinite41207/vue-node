const { DataTypes, Model } = require("sequelize");
const sequelize = require("@database/dbConnection");

const Enums = require("@enums");

class CashFlowItem extends Model {}

CashFlowItem.init(
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
    type: {
      type: DataTypes.ENUM,
      values: Enums.TYPE_OF_MOVEMENT,
      allowNull: false,
      defaultValue: "Receipt",
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
    modelName: "CashFlowItem",
    tableName: "cash_flow_items",
  }
);

module.exports = CashFlowItem;
