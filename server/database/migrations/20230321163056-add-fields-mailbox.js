'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('mailboxes', 'path', {
          type: Sequelize.DataTypes.STRING,
        }),
        queryInterface.addColumn('mailboxes', 'unseen', {
          type: Sequelize.DataTypes.INTEGER,
        }),
        queryInterface.addColumn('mailboxes', 'new', {
          type: Sequelize.DataTypes.INTEGER,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {},
}
