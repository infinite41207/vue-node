'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_files', {
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
        type: Sequelize.DataTypes.STRING(50),
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
      orderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'orders',
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
      return Promise.all([queryInterface.dropTable('order_files', { transaction: t })]);
    });
  },
};
