'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incoming_emails', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      uid: {
        type: Sequelize.DataTypes.INTEGER,

        allowNull: false,
        index: true,
      },
      from: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      to: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      cc: {
        type: Sequelize.DataTypes.TEXT,
      },
      subject: {
        type: Sequelize.DataTypes.TEXT,
      },
      html: {
        type: Sequelize.DataTypes.TEXT,
      },
      attachments: {
        type: Sequelize.DataTypes.TEXT,
      },
      flags: {
        type: Sequelize.DataTypes.TEXT,
      },
      attachmentsAtHardDrive: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasLinks: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      processed: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      emailAccountId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'email_accounts',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mailboxId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'mailboxes',
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
      return Promise.all([queryInterface.dropTable('incoming_emails', { transaction: t })]);
    });
  },
};
