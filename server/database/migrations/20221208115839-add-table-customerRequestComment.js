'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_request_comments', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
      },
      text: {
        type: Sequelize.DataTypes.TEXT,
      },
      byEmail: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailAccountId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailUid: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailTitle: {
        type: Sequelize.DataTypes.STRING,
      },
      emailType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['INCOMING', 'OUTGOING'],
        defaultValue: 'INCOMING',
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
      customerRequestId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'customer_requests',
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
      return Promise.all([queryInterface.dropTable('customer_request_comments', { transaction: t })]);
    });
  },
};
