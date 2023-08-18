'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('interaction_comments', {
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
      interactionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'interactions',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
        type: Sequelize.DataTypes.UUID,
      },
      emailUid: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailId: {
        type: Sequelize.DataTypes.UUID,
      },
      emailTitle: {
        type: Sequelize.DataTypes.STRING,
      },
      emailType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['INCOMING', 'OUTGOING'],
        defaultValue: 'INCOMING',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('interaction_comments', { transaction: t })]);
    });
  },
};
