'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photos_weighting', {
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
      path: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      filename: {
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
      deliveryNoteId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'delivery_notes',
          },
          key: 'id',
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('photos_weighting')
  }
};
