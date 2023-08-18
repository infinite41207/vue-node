'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn('incoming_emails', 'labels', { type: Sequelize.DataTypes.TEXT }, { transaction: t })
      await queryInterface.addColumn(
        'incoming_emails',
        'counterpartyId',
        {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'counterparties',
            },
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        { transaction: t }
      )
    })
  },

  async down(queryInterface, Sequelize) {},
}
