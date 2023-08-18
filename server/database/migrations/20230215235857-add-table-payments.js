"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("register_payments", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      registratorId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      registratorType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        index: true,
      },
      sumPaymentReceipt: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      sumPaymentExpense: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      currencyId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "currencies",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "projects",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      cashFlowItemId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "cash_flow_items",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      paymentTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "payment_types",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.Sequelize.transaction((t) => {
    //   return Promise.all([queryInterface.dropTable("register_payments", { transaction: t })]);
    // });
    await queryInterface.dropTable("register_payments");
  },
};
