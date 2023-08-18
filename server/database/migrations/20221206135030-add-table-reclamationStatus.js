'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_statuses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      adminAccess: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      userAccess: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },

      oracleId: {
        type: Sequelize.DataTypes.STRING,
      },

      code1C: {
        type: Sequelize.DataTypes.STRING,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      color: {
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
      statusgroupid: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_statusgroups',
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
      return Promise.all([queryInterface.dropTable('reclamation_statuses', { transaction: t })]);
    });
  },
};
