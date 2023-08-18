'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('user_setting_items', 'global', { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
        queryInterface.addColumn('user_setting_items', 'default', { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('user_setting_items', 'global', { transaction: t }),
        queryInterface.removeColumn('user_setting_items', 'default', { transaction: t }),
      ])
    })
  }
};
