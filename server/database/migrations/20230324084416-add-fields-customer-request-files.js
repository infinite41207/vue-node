'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // return queryInterface.sequelize.transaction(async (t) => {
    //   await queryInterface.addColumn(
    //     'customer_request_files',
    //     'customerRequestId',
    //     {
    //       type: Sequelize.DataTypes.UUID,
    //       references: {
    //         model: {
    //           tableName: 'customer_requests',
    //         },
    //         key: 'id',
    //       },
    //       onDelete: 'CASCADE',
    //       onUpdate: 'CASCADE',
    //     },
    //     { transaction: t }
    //   )
    // })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
