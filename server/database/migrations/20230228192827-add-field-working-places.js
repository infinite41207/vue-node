'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('working_places', 'desktopMode', { type: Sequelize.DataTypes.BOOLEAN }, { transaction: t }),
        queryInterface.addColumn('working_places', 'desktopName', { type: Sequelize.DataTypes.STRING }, { transaction: t }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('working_places', 'desktopMode', { transaction: t }),
        queryInterface.removeColumn('working_places', 'desktopName', { transaction: t }),
      ])
    })
  },
}
