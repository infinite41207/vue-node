'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('cost_articles', 'markedToDelete', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('cost_articles', 'markedToDelete', { transaction: t })])
    })
  },
}
