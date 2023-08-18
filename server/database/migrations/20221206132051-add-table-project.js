'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(500),
        unique: true,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      progressValue: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DataTypes.DATE,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
      },
      tasks: {
        type: Sequelize.DataTypes.INTEGER,
      },
      comments: {
        type: Sequelize.DataTypes.INTEGER,
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Finished', 'Ongoing'],
        allowNull: false,
        defaultValue: 'Ongoing',
        index: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('projects', { transaction: t })]);
    });
  },
};
