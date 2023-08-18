'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_files', {
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
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },

      description: {
        type: Sequelize.DataTypes.STRING,
      },

      hasProtocol: {
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
      reclamationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamations',
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
      return Promise.all([queryInterface.dropTable('reclamation_files', { transaction: t })]);
    });
  },
};
