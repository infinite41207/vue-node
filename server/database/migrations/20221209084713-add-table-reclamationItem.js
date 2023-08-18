'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_items', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      possitionWh: {
        type: Sequelize.DataTypes.INTEGER,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      kwatera: {
        type: Sequelize.DataTypes.STRING,
      },
      oracleId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      erpPossitions: {
        type: Sequelize.DataTypes.TEXT,
      },
      comment: {
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      reclamationSubjectId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_subjects',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      executionTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_executiontypes', //chyba to
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reclamationDecisionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_decisions', //chyba to
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reclamationPerpetratorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_perpetrators',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reclamationReasonId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_reasons',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reclamationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamations',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('reclamation_items', { transaction: t })]);
    });
  },
};
