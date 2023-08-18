'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incoming_email_links', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      emailUid: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      documentId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      documentType: {
        type: Sequelize.DataTypes.STRING(50),
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
        allowNull: false,
      },
      emailId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'incoming_emails',
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
      return Promise.all([queryInterface.dropTable('incoming_email_links', { transaction: t })]);
    });
  },
};
