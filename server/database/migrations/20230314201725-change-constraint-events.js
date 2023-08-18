'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('crm_events', 'crm_events_counterpartyId_fkey')
      await queryInterface.removeColumn('crm_events', 'counterpartyId')
      await queryInterface.addColumn('crm_events', 'counterpartyId', {
        type: Sequelize.DataTypes.UUID,
      })
      await queryInterface.addConstraint('crm_events', {
        fields: ['counterpartyId'],
        type: 'FOREIGN KEY',
        name: 'crm_events_counterpartyId_fkey',
        references: {
          table: 'counterparties',
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
      await queryInterface.removeConstraint('crm_events', 'crm_events_counterpartyId_fkey', { transaction })
      await queryInterface.removeColumn('crm_events', 'counterpartyId', { transaction })
      await queryInterface.addColumn('crm_events', 'counterpartyId', {
        type: Sequelize.DataTypes.UUID,
      }, { transaction })
      await queryInterface.addConstraint('crm_events', {
        fields: ['counterpartyId'],
        type: 'FOREIGN KEY',
        name: 'crm_events_counterpartyId_fkey',
        references: {
          table: 'vendor_and_customers',
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
