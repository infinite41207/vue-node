'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('event_names', 'markedToDelete', {
          type: Sequelize.DataTypes.BOOLEAN ,
          defaultValue: false,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('event_names', 'markedToDelete', { transaction: t }),
      ])
    })
  },
}

