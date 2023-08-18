'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cr_comment_files', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
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
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      cRCommentId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'customer_request_comments',
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
      return Promise.all([queryInterface.dropTable('cr_comment_files', { transaction: t })]);
    });
  },
};
