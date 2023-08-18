'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('terms_of_payment', {
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
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      days: {
        type: Sequelize.DataTypes.INTEGER,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lang: {
        type: Sequelize.DataTypes.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('terms_of_payment', { transaction: t })]);
    });
  },
};
