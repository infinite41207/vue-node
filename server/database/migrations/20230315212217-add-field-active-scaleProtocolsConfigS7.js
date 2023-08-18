'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('scale_protocols_config_s7', 'active', {
          type: Sequelize.DataTypes.BOOLEAN,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('scale_protocols_config_s7', 'active', { transaction: t }),
      ])
    })
  },
}

