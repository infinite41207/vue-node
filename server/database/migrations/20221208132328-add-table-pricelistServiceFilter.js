'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  
  await queryInterface.createTable('pricelist_service_filters', {
    id: {
      type: Sequelize.DataTypes.UUID,
      
      primaryKey: true,
      allowNull: false,     
    },
    field: {
      type: Sequelize.DataTypes.STRING(36),
      allowNull: false,
    },
    value: {
      type: Sequelize.DataTypes.STRING(36),
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
    pricelistId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: {
          tableName: 'pricelists',
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
      return Promise.all([queryInterface.dropTable('pricelist_service_filters', { transaction: t })]);
    });
  }
};
