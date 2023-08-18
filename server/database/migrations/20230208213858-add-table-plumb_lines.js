"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("register_plumb_lines", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      beginWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      endWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      count: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      enumerator: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
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
      shipUnloadingId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "ships_unloading",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      dispositionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "dispositions",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      scaleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "scales",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      boxId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "boxes",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable("register_plumb_Lines", { transaction: t })]);
    });
  },
};
