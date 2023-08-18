'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_emails', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      oracleId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: ['INCOMING', 'OUTGOING'],
      },
      uid: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      accountId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailDate: {
        type: Sequelize.DataTypes.DATE,
      },
      from: {
        type: Sequelize.DataTypes.STRING,
      },
      to: {
        type: Sequelize.DataTypes.STRING,
      },
      cc: {
        type: Sequelize.DataTypes.STRING,
      },
      tittle: {
        type: Sequelize.DataTypes.STRING,
      },
      emailText: {
        type: Sequelize.DataTypes.TEXT,
      },
      action: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailTplId: {
        type: Sequelize.DataTypes.STRING,
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      sent: {
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
      reclamationStatusId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_statuses',
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
      return Promise.all([queryInterface.dropTable('reclamation_emails', { transaction: t })]);
    });
  },
};
