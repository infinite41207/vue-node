'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outgoing_emails', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      cc: {
        type: Sequelize.DataTypes.TEXT,
      },
      bcc: {
        type: Sequelize.DataTypes.TEXT,
      },
      subject: {
        type: Sequelize.DataTypes.TEXT,
      },
      body: {
        type: Sequelize.DataTypes.TEXT,
      },
      attachments: {
        type: Sequelize.DataTypes.TEXT,
      },
      flags: {
        type: Sequelize.DataTypes.TEXT,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sended: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
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
      fromId: {
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('outgoing_emails', { transaction: t })])
    })
  },
}
