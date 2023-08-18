'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('email_templates', 'markedToDelete', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('email_templates', 'markedToDelete', { transaction: t })])
    })
  },
}
