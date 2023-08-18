'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn('incoming_email_attachments', 'path', {
          type: Sequelize.TEXT,
          allowNull: false,
        }
          ,
          { transaction: t }),

        queryInterface.changeColumn('incoming_email_attachments', 'filename', {
          type: Sequelize.STRING(500),
          allowNull: false,
        }
          ,
          { transaction: t }),

        queryInterface.changeColumn('incoming_email_attachments', 'originalname', {
          type: Sequelize.STRING(500),
          allowNull: false,
        }
          ,
          { transaction: t })
      ])
    })

  },

  async down(queryInterface, Sequelize) {
  },
}
