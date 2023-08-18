"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("calendar_events", "isPrivate", { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("calendar_events", "isPrivate", { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
      ]);
    });
  },
};