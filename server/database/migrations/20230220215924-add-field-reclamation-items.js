'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('reclamation_items', 'reclamationClientDemandId', { type: Sequelize.DataTypes.UUID })
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
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('reclamation_items', 'reclamation_items_clientDemandId_fkey', { transaction })
      await queryInterface.removeColumn('reclamation_items', 'reclamationClientDemandId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
};
