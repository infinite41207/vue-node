"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_operations', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        index: true,
      },
      number: {
        type: Sequelize.DataTypes.STRING(9),
        allowNull: false,
        index: true,
      },
      numberStr: {
        type: Sequelize.DataTypes.STRING(50),
      },
      reference: {
        type: Sequelize.DataTypes.STRING(150),
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_MOVEMENT,
        allowNull: false,
        defaultValue: "Receipt",
        index: true,
      },
      description: {
        type: Sequelize.DataTypes.STRING(250),
      },
      sumPayment: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
        allowNull: false,
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
      authorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.Sequelize.transaction((t) => {
    //   return Promise.all([queryInterface.dropTable("payment_operations", { transaction: t })]);
    // });
    await queryInterface.dropTable("payment_operations");
  },
};
