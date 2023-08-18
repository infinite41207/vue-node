'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamation_deliveries', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Przygotowane', 'Wysłane'],
        allowNull: false,
        defaultValue: 'Przygotowane',
        index: true,
      },
      deliveryDate: {
        type: Sequelize.DataTypes.DATE,
      },
      deliveryNote: {
        type: Sequelize.DataTypes.STRING,
      },
      deliveryAddress: {
        type: Sequelize.DataTypes.STRING,
      },
      items: {
        type: Sequelize.DataTypes.TEXT,
      },
      comment: {
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
      deliveryTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'delivery_types',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      return Promise.all([queryInterface.dropTable('reclamation_deliveries', { transaction: t })]);
    });
  },
};
