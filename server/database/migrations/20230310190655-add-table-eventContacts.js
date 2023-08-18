'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('event_contacts', {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          index: true,
        },
        markedToDelete: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      })

      // await queryInterface.addConstraint('event_contacts', {
      //   fields: ['vendorId'],
      //   type: 'FOREIGN KEY',
      //   name: 'event_contacts_vendorId_fkey',
      //   references: {
      //     table: 'vendor_and_customers',
      //     field: 'id',
      //   },
      //   onDelete: 'set null',
      //   onUpdate: 'cascade',
      // })

      // await queryInterface.addConstraint('event_contacts', {
      //   fields: ['eventId'],
      //   type: 'FOREIGN KEY',
      //   name: 'event_contacts_eventId_fkey',
      //   references: {
      //     table: 'crm_events',
      //     field: 'id',
      //   },
      //   onDelete: 'set null',
      //   onUpdate: 'cascade',
      // })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeConstraint('event_contacts', 'event_contacts_eventId_fkey', { transaction })
      await queryInterface.removeConstraint('event_contacts', 'event_contacts_vendorId_fkey', { transaction })
      Promise.all([queryInterface.dropTable('event_contacts', { transaction })])
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
