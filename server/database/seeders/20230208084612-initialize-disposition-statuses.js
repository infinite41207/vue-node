'use strict'
const uuid = require('uuid')

module.exports = {
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface

    const statuses = [
      {
        id: uuid.v4(),
        name: 'Aktywny',
        key: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Zamknięta',
        key: 'Closed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Zatrzymana',
        key: 'Stoped',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Usunięta',
        key: 'Deleted',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'W drodze',
        key: 'OnTheWay',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Do zatwierdezenia',
        key: 'ForAcceptance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Do wyjaśnienia',
        key: 'ToClarify',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Wjazd na parking',
        key: 'ParkingEntry',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Accepted',
        key: 'Zatwierdzona',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Do realizacji',
        key: 'ToBeImplemented',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Do wyjaśnienia bezpieczeństwa',
        key: 'ToClarifySecurity',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'NaTerminalu',
        key: 'NaTerminalu',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Wyjazd z parkingu',
        key: 'ParkingDeparture',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'W magazynie',
        key: 'OnWarehouse',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Magazyn do wyjaśnienia',
        key: 'ToClarifyWarehouse',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Pierwsze wazenie',
        key: 'FirstWeighing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Drugie wazenie',
        key: 'SecondWeighing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'załadowany',
        key: 'Loaded',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Rozładowany',
        key: 'Unloaded',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Zakończona',
        key: 'End',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Wyjaśnić wagowy',
        key: 'ToClarifyWagowy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Do wyjaśnienia dysponenta',
        key: 'ToClarifyDisponent',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Dosypka',
        key: 'AddWeight',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Odsypka',
        key: 'RemoveWeight',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Wyciągnięto z parkingu',
        key: 'PulledOutOfParking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'Wyjście z parkingu',
        key: 'ParkingExit',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'ZeroDN',
        key: 'ZeroDN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    let currentStatuses = await sequelize.query('SELECT * FROM disp_statuses')

    currentStatuses = JSON.stringify(currentStatuses)
    currentStatuses = JSON.parse(currentStatuses)
    currentStatuses = currentStatuses[0]

    let newItems = []

    for (let status of statuses) {
      const existItem = currentStatuses.find((el) => el.key === status.key)
      if (existItem) {
        await queryInterface.bulkUpdate('disp_statuses', { ...status }, { key: existItem.key }).catch((error) => {
          console.error(error)
        })
      } else {
        newItems.push({ ...status })
      }

      // if (existItem) {
      //   await queryInterface.bulkUpdate('disp_statuses', { ...status }, { key: existItem.key }).catch((error) => {
      //     console.error(error)
      //   })
      // } else {
      //   newItems.push({ ...status })
      // }
    }

    if (newItems.length > 0) {
      await queryInterface.bulkInsert('disp_statuses', newItems).catch((error) => {
        console.error(error)
      })
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('disp_statuses', null, {})
  },
}
