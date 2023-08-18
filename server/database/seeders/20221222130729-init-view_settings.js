'use strict'

const moduleAlias = require('module-alias')
require('dotenv').config({ path: `${__dirname}/../../.env` })

moduleAlias.addAliases({
  '@database': `${__dirname}/../../database`,
})

const ViewSettingData = require('@database/initialdata/view_settings')

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface

    const viewSettings = ViewSettingData

    let currentItems = await sequelize.query('SELECT * FROM view_settings')

    currentItems = JSON.stringify(currentItems)
    currentItems = JSON.parse(currentItems)
    currentItems = currentItems[0]

    let newItems = []

    for (let vsItem of viewSettings) {
      const existItem = currentItems.find((el) => el.id === vsItem.id)
      if (existItem) {
        await queryInterface.bulkUpdate('view_settings', { ...vsItem }, { id: existItem.id }).catch((error) => {
          console.error(error)
        })
      } else {
        newItems.push({ ...vsItem })
      }
    }

    if (newItems.length > 0) {
      await queryInterface.bulkInsert('view_settings', newItems).catch((error) => {
        console.error(error)
      })
    }

    for (const currItem of currentItems) {
      const existItem = viewSettings.find((el) => el.id === currItem.id)

      if (!existItem) {
        try {
          await sequelize.query(`DELETE FROM view_settings WHERE id = ${currItem.id}`)
        } catch (error) {
          await sequelize.query(`UPDATE view_settings SET "markedToDelete" = true WHERE id = ${currItem.id}`).catch((error) => {
            console.error(error)
          })
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {},
}
