'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('event_statuses', 'markedToDelete', {
          type: Sequelize.DataTypes.BOOLEAN ,
          defaultValue: false,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('event_statuses', 'markedToDelete', { transaction: t }),
      ])
    })
  },
}

