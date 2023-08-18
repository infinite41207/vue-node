'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_histories', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      actionDate: {
        type: Sequelize.DataTypes.DATE,
      },
      oracleId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      actionId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      recstatusFrom: {
        type: Sequelize.DataTypes.INTEGER,
      },
      recstatusTo: {
        type: Sequelize.DataTypes.INTEGER,
      },
      decision: {
        type: Sequelize.DataTypes.INTEGER,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      comment: {
        type: Sequelize.DataTypes.STRING,
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
            tableName: 'users',
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
      return Promise.all([queryInterface.dropTable('reclamation_histories', { transaction: t })]);
    });
  },
};
