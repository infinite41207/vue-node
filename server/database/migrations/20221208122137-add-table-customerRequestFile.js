'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_request_files', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      path: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      originalname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      size: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      fileDestination: {
        type: Sequelize.DataTypes.ENUM,
        values: ['FOR_CUSTOMER', 'FROM_CUSTOMER', 'CALCULATION', 'OTHER'],
        allowNull: true,
        defaultValue: 'OTHER',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      emailAccountId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'customer_requests',
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
      return Promise.all([queryInterface.dropTable('customer_request_files', { transaction: t })])
    })
  },
}
