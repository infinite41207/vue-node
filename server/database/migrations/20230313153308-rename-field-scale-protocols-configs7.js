'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.removeConstraint('scale_protocols_config_s7', 'scale_protocols_config_s7_scaleProtocolId_fkey', { transaction })
      await queryInterface.renameColumn('scale_protocols_config_s7', 'scaleProtocolId', 'parentId', { transaction })
      await queryInterface.addConstraint('scale_protocols_config_s7', {
        fields: ['parentId'],
        type: 'foreign key',
        name: 'scale_protocols_config_s7_parentId_fkey',
        references: {
          table: 'scale_protocols',
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
