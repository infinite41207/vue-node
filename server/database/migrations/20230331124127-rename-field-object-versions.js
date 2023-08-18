'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('object_versions', 'objectName', 'objectType')])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('object_versions', 'objectType', 'objectName')])
  },
}
