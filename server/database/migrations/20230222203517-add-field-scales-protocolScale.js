const PROTOCOL_SCALE_PARSE = ['toledoSimple', 'toledoSimpleTwice', 'toledoModbus']
;('use strict')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('scales', 'protocolType', {
          type: Sequelize.DataTypes.ENUM('Mechanical', 'IoT', 'TCP/IP', 'COM'),
          defaultValue: 'IoT',
        }),
        queryInterface.addColumn('scales', 'tcpIp', {
          type: Sequelize.DataTypes.STRING,
        }),
        queryInterface.addColumn('scales', 'tcpPort', {
          type: Sequelize.DataTypes.INTEGER,
        }),
        queryInterface.addColumn('scales', 'scaleCom', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: 'COM1',
        }),
        queryInterface.addColumn('scales', 'cmdGetWeight', {
          type: Sequelize.DataTypes.STRING,
        }),
        queryInterface.addColumn('scales', 'protocolScaleParse', {
          type: Sequelize.DataTypes.ENUM('toledoSimple', 'toledoSimpleTwice', 'toledoModbus'),
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('scales', 'protocolType', { transaction: t }),
        queryInterface.removeColumn('scales', 'tcpIp', { transaction: t }),
        queryInterface.removeColumn('scales', 'tcpPort', { transaction: t }),
        queryInterface.removeColumn('scales', 'scaleCom', { transaction: t }),
      ])
    })
  },
}
