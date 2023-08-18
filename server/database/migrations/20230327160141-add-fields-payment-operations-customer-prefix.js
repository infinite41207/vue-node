'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('payment_operations', 'prefix', {
          type: Sequelize.STRING(4),
          allowNull: false,
          index: true,
        }, { transaction: t }),
        queryInterface.addColumn('payment_operations', 'customerId', {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'counterparties',
            },
            key: 'id',
          },
        }, { transaction: t }),
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
