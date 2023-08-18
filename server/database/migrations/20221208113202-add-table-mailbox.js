'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mailboxes', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      parent: {
        type: Sequelize.DataTypes.STRING,
      },
      delimiter: {
        type: Sequelize.DataTypes.STRING,
      },
      attribs: {
        type: Sequelize.DataTypes.TEXT,
      },
      total: {
        type: Sequelize.DataTypes.INTEGER,
      },
      nextUid: {
        type: Sequelize.DataTypes.INTEGER,
      },
      uidvalidity: {
        type: Sequelize.DataTypes.INTEGER,
      },
      flags: {
        type: Sequelize.DataTypes.TEXT,
      },
      permFlags: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('mailboxes', { transaction: t })]);
    });
  },
};
