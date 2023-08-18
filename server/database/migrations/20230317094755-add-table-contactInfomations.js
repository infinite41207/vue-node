'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('contact_information', {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        objectType: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false, 
        },
        objectId: {
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
          allowNull: false,
        },
        contactType: {
          type: Sequelize.DataTypes.ENUM,
          values: ['phone', 'email', 'messenger', 'skype', 'social'],
          allowNull: false,
        },
        contactValue: {
          type: Sequelize.DataTypes.STRING(500),
          allowNull: false,
        },
        markedToDelete: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      })
    } catch (err) {
      throw err
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      Promise.all([queryInterface.dropTable('contact_information', { transaction })])
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
