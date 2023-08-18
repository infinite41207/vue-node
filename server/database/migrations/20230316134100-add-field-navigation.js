'use strict'

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@common': `${__dirname}/../../modules/common`,
  '@enums': `${__dirname}/../../modules/enums`,
})

const Enums = require('@enums')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('navigations', 'placing', {
          type: Sequelize.DataTypes.ENUM,
          values: Enums.NAVIGATION_PLACINGS,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('navigations', 'placing', { transaction: t })])
    })
  },
}
