'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.removeConstraint('driver_forwarders', 'driver_forwarders_driverId_fkey', { transaction })
      await queryInterface.renameColumn('driver_forwarders', 'driverId', 'parentId', { transaction })
      await queryInterface.addConstraint('driver_forwarders', {
        fields: ['parentId'],
        type: 'foreign key',
        name: 'driver_forwarders_parentId_fkey',
        references: {
          table: 'drivers',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        transaction,
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {},
}
