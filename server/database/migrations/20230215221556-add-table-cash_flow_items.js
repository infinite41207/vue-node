"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_flow_items', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
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
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_MOVEMENT,
        allowNull: false,
        defaultValue: "Receipt",
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
    });
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.Sequelize.transaction((t) => {
    //   return Promise.all([queryInterface.dropTable("cash_flow_items", { transaction: t })]);
    // });
    await queryInterface.dropTable("cash_flow_items");
  },
};
