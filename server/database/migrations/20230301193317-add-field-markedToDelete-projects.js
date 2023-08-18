'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('projects', 'markedToDelete', {
          type: Sequelize.DataTypes.BOOLEAN ,
          defaultValue: false,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('projects', 'markedToDelete', { transaction: t }),
      ])
    })
  },
}

