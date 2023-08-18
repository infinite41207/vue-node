'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scale_protocols_config_s7', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: Sequelize.DataTypes.STRING(25),
        allowNull: false,
      },
      server: {
        type: Sequelize.DataTypes.STRING(15),
      },
      valueType: {
        type: Sequelize.DataTypes.STRING(20),
      },
      register: {
        type: Sequelize.DataTypes.STRING(20),
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      scaleProtocolId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'scale_protocols',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('scale_protocols_config_s7', { transaction: t })])
    })
  },
}
