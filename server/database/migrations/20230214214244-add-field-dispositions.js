"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("dispositions", "researchDate", { type: Sequelize.DataTypes.DATE }, { transaction: t }),
        queryInterface.addColumn("dispositions", "datePlannedService", { type: Sequelize.DataTypes.DATE }, { transaction: t }),
        queryInterface.addColumn("dispositions", "allowSetZero", { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("dispositions", "researchDate", { transaction: t }),
        queryInterface.removeColumn("dispositions", "datePlannedService", { transaction: t }),
        queryInterface.removeColumn("dispositions", "allowSetZero", { transaction: t }),
      ]);
    });
  },
};
