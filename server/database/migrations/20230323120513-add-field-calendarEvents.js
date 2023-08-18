'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('calendar_events', 'parentType', { type: Sequelize.DataTypes.STRING }),
      queryInterface.addColumn('calendar_events', 'parentId', { type: Sequelize.DataTypes.STRING }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('calendar_events', 'parentType', { transaction: t }),
        queryInterface.removeColumn('calendar_events', 'parentId', { transaction: t }),
      ]);
    });
  },
};
