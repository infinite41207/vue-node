'use strict'

const moduleAlias = require('module-alias')

require('dotenv').config({ path: `${__dirname}/../../.env` })
moduleAlias.addAliases({
  '@database': `${__dirname}/../../database`,
})

const UserSettingItemsData = require('@database/initialdata/user_setting_items')

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface

    const userSettingItems = UserSettingItemsData

    let currUserSettingItems = await sequelize.query('SELECT * FROM user_setting_items')

    currUserSettingItems = JSON.stringify(currUserSettingItems)
    currUserSettingItems = JSON.parse(currUserSettingItems)
    currUserSettingItems = currUserSettingItems[0]

    let newItems = []

    for (let userSettingItem of userSettingItems) {
      delete userSettingItem.presentation
      const existItem = currUserSettingItems.find((el) => el.id === userSettingItem.id)
      if (existItem) {
        await queryInterface.bulkUpdate('user_setting_items', { ...userSettingItem }, { id: existItem.id }).catch((error) => {
          console.error(error)
        })
      } else {
        newItems.push({ ...userSettingItem })
      }
    }

    if (newItems.length > 0) {
      await queryInterface.bulkInsert('user_setting_items', newItems).catch((error) => {
        console.error(error)
      })
    }
  },

  async down(queryInterface, Sequelize) {},
}
