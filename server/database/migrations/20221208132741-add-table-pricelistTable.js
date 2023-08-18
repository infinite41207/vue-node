'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricelist_tables', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      sortNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      coordinateX: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      coordinateY: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      minX: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      minY: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      maxX: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      maxY: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL(15, 2),
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('pricelist_tables', { transaction: t })]);
    });
  },
};
