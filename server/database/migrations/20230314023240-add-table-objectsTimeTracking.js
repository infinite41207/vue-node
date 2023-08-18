'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('objects_time_tracking', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },         
      objectType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      objectId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      startDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
      },
      comment: {
        type: Sequelize.DataTypes.TEXT,
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
    })
  },

  async down(queryInterface, Sequelize) {
   
  },
}
