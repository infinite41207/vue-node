'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('reclamation_items', 'reclamation_items_clientDemandId_fkey')
      await queryInterface.addConstraint('reclamation_items', {
        fields: ['reclamationClientDemandId'],
        type: 'FOREIGN KEY',
        name: 'reclamation_items_clientDemandId_fkey',
        references: {
          table: 'reclamation_client_demands',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('reclamation_items', 'reclamation_items_clientDemandId_fkey', { transaction })
      await queryInterface.addConstraint('reclamation_items', {
        fields: ['reclamationClientDemandId'],
        type: 'FOREIGN KEY',
        name: 'reclamation_items_clientDemandId_fkey',
        references: {
          table: 'disp_statuses',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
};
