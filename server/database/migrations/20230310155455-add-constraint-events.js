'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('contact_persons', 'standingId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('contact_persons', {
        fields: ['standingId'],
        type: 'FOREIGN KEY',
        name: 'contact_persons_standingId_fkey',
        references: {
          table: 'standings',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      })

      await queryInterface.addColumn('crm_events', 'eventStatusId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('crm_events', {
        fields: ['eventStatusId'],
        type: 'FOREIGN KEY',
        name: 'crm_events_eventStatusId_fkey',
        references: {
          table: 'event_statuses',
          field: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      })

      await queryInterface.addColumn('crm_events', 'eventNameId', { type: Sequelize.DataTypes.UUID })
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
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('contact_persons', 'contact_persons_standingId_fkey', { transaction })
      await queryInterface.removeColumn('contact_persons', 'standingId', { transaction })
      await queryInterface.removeConstraint('crm_events', 'crm_events_eventStatusId_fkey', { transaction })
      await queryInterface.removeColumn('crm_events', 'eventStatusId', { transaction })
      await queryInterface.removeConstraint('crm_events', 'crm_events_eventNameId_fkey', { transaction })
      await queryInterface.removeColumn('crm_events', 'eventNameId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
