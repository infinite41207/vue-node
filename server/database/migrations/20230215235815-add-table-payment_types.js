"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_types', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(500),
        unique: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ["Finished", "Ongoing"],
        allowNull: false,
        defaultValue: "Ongoing",
        index: true,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_PAYMENT,
        allowNull: false,
        defaultValue: "Cash",
        index: true,
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
    });
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.Sequelize.transaction((t) => {
    //   return Promise.all([queryInterface.dropTable("payment_types", { transaction: t })]);
    // });
    await queryInterface.dropTable("payment_types");
  },
};
