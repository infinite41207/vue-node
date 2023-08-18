'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('bp_exemplars', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Active', 'Paused', 'Executed'],
        allowNull: false,
        defaultValue: 'Active',
        index: true,
      },
      stage: {
        type: Sequelize.DataTypes.TEXT,
      },
      ownerType: {
        type: Sequelize.DataTypes.STRING,
      },
      ownerId: {
        type: Sequelize.DataTypes.UUID,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      definitionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'bp_definitions',
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
      return Promise.all([queryInterface.dropTable('bp_exemplars', { transaction: t })]);
    });
  },
};
