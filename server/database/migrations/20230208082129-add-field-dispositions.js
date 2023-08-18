'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('dispositions', 'statusId', { type: Sequelize.DataTypes.UUID })
      await queryInterface.addConstraint('dispositions', {
        fields: ['statusId'],
        type: 'FOREIGN KEY',
        name: 'dispositions_statusId_fkey',
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
      await queryInterface.removeConstraint('dispositions', 'dispositions_statusId_fkey', { transaction })
      await queryInterface.removeColumn('dispositions', 'statusId', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
};
