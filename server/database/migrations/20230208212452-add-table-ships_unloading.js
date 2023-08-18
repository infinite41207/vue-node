"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ships_unloading", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      numberStr: {
        type: Sequelize.DataTypes.STRING(50),
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      prefix: {
        type: Sequelize.DataTypes.STRING(4),
        allowNull: false,
        default: "",
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      comment: {
        type: Sequelize.DataTypes.STRING,
      },
      netto: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      beginWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      endWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
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
      positionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "positions",
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
      warehouseId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "warehouses",
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
      return Promise.all([queryInterface.dropTable("ships_unloading", { transaction: t })]);
    });
  },
};
