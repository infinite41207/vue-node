'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incoming_email_attachments', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
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
        allowNull: false,
      },
      emailUid: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        index: true,
      },
      path: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      originalname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      checksum: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      contentDisposition: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('incoming_email_attachments', { transaction: t })]);
    });
  },
};
