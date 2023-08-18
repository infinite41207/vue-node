"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("calendar_events", "creator", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.addColumn("calendar_events", "attendees", { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("calendar_events", "creator", { type: Sequelize.DataTypes.STRING }, { transaction: t }),
        queryInterface.removeColumn("calendar_events", "attendees", { type: Sequelize.DataTypes.TEXT }, { transaction: t }),
      ]);
    });
  },
};