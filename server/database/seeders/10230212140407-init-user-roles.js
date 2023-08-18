'use strict'

const moduleAlias = require('module-alias')
require('dotenv').config({ path: `${__dirname}/../../.env` })

moduleAlias.addAliases({
  '@database': `${__dirname}/../../database`,
})

const UserRolesData = require('@database/initialdata/user_roles')

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    const userRoles = UserRolesData

    let currUserRoles = await sequelize.query('SELECT * FROM user_roles')

    currUserRoles = JSON.stringify(currUserRoles)
    currUserRoles = JSON.parse(currUserRoles)
    currUserRoles = currUserRoles[0]

    let newItems = []

    for (let userRole of userRoles) {
      delete userRole.presentation
      const existItem = currUserRoles.find((el) => el.id === userRole.id)
      if (existItem) {
        await queryInterface.bulkUpdate('user_roles', { ...userRole }, { id: existItem.id }).catch((error) => {
          console.error(error)
        })
      } else {
        newItems.push({ ...userRole })
      }
    }

    if (newItems.length > 0) {
      await queryInterface.bulkInsert('user_roles', newItems).catch((error) => {
        console.error(error)
      })
    }
  },

  async down(queryInterface, Sequelize) {},
}
