'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('register_weighted_dispositions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      dispositionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'dispositions',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      scaleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'scales',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      weighingStationId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'weighing_stations',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      authorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
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
      return Promise.all([queryInterface.dropTable('register_weighted_dispositions', { transaction: t })])
    })
  },
}
