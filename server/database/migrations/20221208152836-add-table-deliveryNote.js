"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@common": `${__dirname}/../../modules/common`,
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("delivery_notes", {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
        default: "AAA",
        index: true,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      brutto: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      bruttoTime: {
        type: Sequelize.DataTypes.DATE,
      },
      comment: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      netto: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      nettoTime: {
        type: Sequelize.DataTypes.DATE,
      },
      quantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      state: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.DELIVERY_NOTE_STATE,
      },
      tare: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
        allowNull: false,
      },
      tareTime: {
        type: Sequelize.DataTypes.DATE,
      },
      trainNumber: {
        type: Sequelize.DataTypes.STRING(20),
      },
      typeOfDocument: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_DOCUMENT,
        allowNull: false,
      },
      typeOfOperation: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_OPERATION,
        allowNull: false,
      },
      cancelWeighting: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      approved: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      approvedDate: {
        type: Sequelize.DataTypes.DATE,
      },
      customsNumber: {
        type: Sequelize.DataTypes.STRING,
      },
      dateIssueDSK: {
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
      bruttoAuthorId: {
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
      customerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "vendor_and_customers",
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
      driverId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "drivers",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      forwarderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "vendor_and_customers",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "products",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      nettoAuthorId: {
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
      scaleBruttoId: {
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
      scaleTareId: {
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
      scaleNettoId: {
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
      schemeOfCargoId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "schemes_of_cargo",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      shipId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "ships",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tareAuthorId: {
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
      vehicleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "vehicles",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      trailerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "vehicles",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      vendorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "vendor_and_customers",
          },
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      approvedAuthorId: {
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
      mineId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "mines",
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
      return Promise.all([queryInterface.dropTable("delivery_notes", { transaction: t })]);
    });
  },
};
