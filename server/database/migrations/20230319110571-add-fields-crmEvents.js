'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('crm_events', 'parentType', {
          type: Sequelize.DataTypes.STRING(50),
          //allowNull: false,
        }),
        queryInterface.addColumn('crm_events', 'parentId', {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        }),
      ])
    })
  },

  async down(queryInterface, Sequelize) {},
}
