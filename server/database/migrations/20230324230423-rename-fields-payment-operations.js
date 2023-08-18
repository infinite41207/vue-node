'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('payment_operations', 'type', 'typeOfMovement'),
        queryInterface.renameColumn('payment_operations', 'description', 'comment'),
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('payment_operations', 'typeOfMovement', 'type')
    await queryInterface.renameColumn('payment_operations', 'comment', 'description')
  }
};
