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
        queryInterface.addColumn('payment_operations', 'typeOfPayment', {
          type: Sequelize.DataTypes.ENUM,
          values: Enums.TYPE_OF_PAYMENT,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('payment_operations', 'typeOfPayment', { transaction: t })])
    })
  },
}
