'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('object_versions', {
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
      objectData: {
        type: Sequelize.DataTypes.TEXT,
      },
      description: {
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
      return Promise.all([queryInterface.dropTable('object_versions', { transaction: t })]);
    });
  },
};
