'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      started: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.STRING(14),
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      authorName: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      importance: {
        type: Sequelize.DataTypes.ENUM,
        values: ['HIGHT', 'NORMAL', 'LOW', 'NOT_SET'],
        allowNull: false,
      },
      executionPeriod: {
        type: Sequelize.DataTypes.DATE,
      },
      executorName: {
        type: Sequelize.DataTypes.STRING(50),
      },
      executed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      executionDate: {
        type: Sequelize.DataTypes.DATE,
      },
      executionAccepted: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      executionAcceptanceDate: {
        type: Sequelize.DataTypes.DATE,
      },
      executionResult: {
        type: Sequelize.DataTypes.TEXT,
      },
      executionHistory: {
        type: Sequelize.DataTypes.TEXT,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      subjectString: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
      },
      emailFrom: {
        type: Sequelize.DataTypes.STRING(100),
      },
      emailId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      emailTitle: {
        type: Sequelize.DataTypes.STRING(1024),
      },
      emailBodyType: {
        type: Sequelize.DataTypes.ENUM,
        values: ['html', 'text'],
        allowNull: false,
      },
      emailBody: {
        type: Sequelize.DataTypes.TEXT,
      },
      emailPriority: {
        type: Sequelize.DataTypes.STRING(25),
      },
      emailCategory: {
        type: Sequelize.DataTypes.STRING(150),
      },
      emailDate: {
        type: Sequelize.DataTypes.DATE,
      },
      fromErp: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ownerType: {
        type: Sequelize.DataTypes.STRING,
      },
      ownerId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      bpDefinition: {
        type: Sequelize.DataTypes.INTEGER,
      },
      stage: {
        type: Sequelize.DataTypes.INTEGER,
      },
      parentTask: {
        type: Sequelize.DataTypes.INTEGER,
      },
      checkExecution: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      checkResult: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
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
      executorId: {
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
      checkerId: {
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
      customerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'counterparties',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      executorRoleId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'executor_roles',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      orderId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'orders',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      templateId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'task_templates',
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
      return Promise.all([queryInterface.dropTable('tasks', { transaction: t })])
    })
  },
}
