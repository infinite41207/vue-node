'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      objectId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      objectName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: ['INFO', 'WARNING', 'ERROR'],
        defaul: 'INFO',
      },
      title: {
        type: Sequelize.DataTypes.TEXT,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      read: {
        type: Sequelize.DataTypes.BOOLEAN,
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
      userId: {
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('notifications', { transaction: t })]);
    });
  },
};
