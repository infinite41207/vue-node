'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('app_settings', {
      id: {
        type: Sequelize.DataTypes.UUID,
        
        primaryKey: true,
        allowNull: false,
      },
      valueType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Number', 'String', 'Boolean', 'Date'],
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      refModelName: {
        type: Sequelize.DataTypes.STRING(50),
      },
      value: {
        type: Sequelize.DataTypes.STRING,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('app_settings', { transaction: t })]);
    });
  }
};
