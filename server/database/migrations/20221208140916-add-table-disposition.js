"use strict";

const moduleAlias = require("module-alias");

moduleAlias.addAliases({
  "@common": `${__dirname}/../../modules/common`,
  "@enums": `${__dirname}/../../modules/enums`,
});

const Enums = require("@enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dispositions", {
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
      comment: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      numberOfWeighings: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfWeighted: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      productCondition: {
        type: Sequelize.DataTypes.STRING(50),
      },
      quantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      trainNumber: {
        type: Sequelize.DataTypes.STRING(20),
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.TYPE_OF_DISPOSITION,
        allowNull: false,
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
      beginWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      endWeighting: {
        type: Sequelize.DataTypes.DATE,
      },
      netto: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      closed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      state: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.DISPOSITION_STATE,
        allowNull: false,
      },
      ratified: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      firstQuantity: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      advicesNumber: {
        type: Sequelize.DataTypes.STRING(10),
      },
      approvedDate: {
        type: Sequelize.DataTypes.DATE,
      },
      deliveryNoteNumber: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: false,
      },
      firstWeight: {
        type: Sequelize.DataTypes.DECIMAL(15, 3),
      },
      arrivalDateDriver: {
        type: Sequelize.DataTypes.DATE,
      },
      correspondence: {
        type: Sequelize.DataTypes.TEXT,
      },
      driverPhoneNumber: {
        type: Sequelize.DataTypes.STRING(12),
      },
      carsQueueStatus: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.CAR_QUEUE_STATUS,
      },
      useResearch: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      researchResult: {
        type: Sequelize.DataTypes.ENUM,
        values: Enums.RESEARCH_RESULT,
      },
      createInSystemSkup: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      gmp: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      gmpCheck: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      retarning: {
        type: Sequelize.DataTypes.DECIMAL(5, 0),
      },
      allowRetaring: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      customsNumber: {
        type: Sequelize.DataTypes.STRING,
      },
      dateIssueDSK: {
        type: Sequelize.DataTypes.DATE,
      },
      barCode: {
        type: Sequelize.DataTypes.STRING(20),
      },
      driverTicket: {
        type: Sequelize.DataTypes.STRING(10),
      },
      entryTicket: {
        type: Sequelize.DataTypes.STRING(40),
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
      carrierId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "carriers",
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
      orderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "transport_orders",
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
      scaleTwoId: {
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
      actualWarehouseId: {
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
      weighingStationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "weighing_stations",
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
      assortmentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "assortments",
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
      return Promise.all([queryInterface.dropTable("dispositions", { transaction: t })]);
    });
  },
};
