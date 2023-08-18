'use strict'

const moduleAlias = require('module-alias')
require('dotenv').config({ path: `${__dirname}/../../.env` })

moduleAlias.addAliases({
  '@database': `${__dirname}/../../database`,
})

const NavigationSettingData = require('@database/initialdata/navigation')

module.exports = {
  async up(queryInterface, Sequelize) {
    const navSettings = NavigationSettingData
    let navTable = []

    await queryInterface.bulkDelete('navigations', null, {})

    for (let navItem of navSettings) {
      navTable.push({ ...navItem, createdAt: new Date(), updatedAt: new Date() })
    }

    return await queryInterface.bulkInsert('navigations', navTable).catch((error) => {
      console.error(error)
    })
  },

  async down(queryInterface, Sequelize) {},
}
