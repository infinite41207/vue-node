'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,       
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
      },
      email: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      abbreviation: {
        type: Sequelize.DataTypes.STRING(10),
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('employees', { transaction: t })]);
    });
  }
};
