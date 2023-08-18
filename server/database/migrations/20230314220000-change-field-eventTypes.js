'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('crm_events', 'crm_events_eventNameId_fkey')
      await queryInterface.removeColumn('crm_events', 'eventNameId')
      await queryInterface.renameTable('event_names', 'event_types')
      await queryInterface.addColumn('crm_events', 'eventTypeId', {
        type: Sequelize.DataTypes.UUID,
      })
      await queryInterface.addConstraint('crm_events', {
        fields: ['eventTypeId'],
        type: 'FOREIGN KEY',
        name: 'crm_events_eventTypeId_fkey',
        references: {
          table: 'event_types',
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
      await queryInterface.removeConstraint('crm_events', 'crm_events_eventTypeId_fkey', { transaction })
      await queryInterface.removeColumn('crm_events', 'eventTypeId', { transaction })
      await queryInterface.renameTable('event_types', 'event_names', { transaction })
      await queryInterface.addColumn('crm_events', 'eventNameId', {
        type: Sequelize.DataTypes.UUID,
      }, { transaction })
      await queryInterface.addConstraint('crm_events', {
        fields: ['eventNameId'],
        type: 'FOREIGN KEY',
        name: 'crm_events_eventNameId_fkey',
        references: {
          table: 'event_names',
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
