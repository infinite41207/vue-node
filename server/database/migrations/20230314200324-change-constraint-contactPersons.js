'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('contact_persons', 'contact_persons_vendorId_fkey')
      await queryInterface.removeColumn('contact_persons', 'vendorId')
      await queryInterface.addColumn('contact_persons', 'counterpartyId', {
        type: Sequelize.DataTypes.UUID,
      })
      await queryInterface.addConstraint('contact_persons', {
        fields: ['counterpartyId'],
        type: 'FOREIGN KEY',
        name: 'contact_persons_counterpartyId_fkey',
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
      await queryInterface.removeConstraint('contact_persons', 'contact_persons_counterpartyId_fkey', { transaction })
      await queryInterface.removeColumn('contact_persons', 'vendorId', { transaction })
      await queryInterface.addColumn('contact_persons', 'counterpartyId', {
        type: Sequelize.DataTypes.UUID,
      }, { transaction })
      await queryInterface.addConstraint('contact_persons', {
        fields: ['vendorId'],
        type: 'FOREIGN KEY',
        name: 'contact_persons_vendorId_fkey',
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
