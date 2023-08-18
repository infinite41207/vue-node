'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reclamations', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.STRING,
      },
      inputDate: {
        type: Sequelize.DataTypes.DATE,
      },
      salesDate: {
        type: Sequelize.DataTypes.DATE,
      },
      decisionDate: {
        type: Sequelize.DataTypes.DATE,
      },
      salesOrder: {
        type: Sequelize.DataTypes.STRING,
      },
      salesReference: {
        type: Sequelize.DataTypes.STRING,
      },
      salesRequest: {
        type: Sequelize.DataTypes.STRING,
      },
      docGroup: {
        type: Sequelize.DataTypes.STRING,
      },
      executionDate: {
        type: Sequelize.DataTypes.DATE,
      },
      executionTerm: {
        type: Sequelize.DataTypes.DATE,
      },
      executionDays: {
        type: Sequelize.DataTypes.INTEGER,
      },
      deliveryTerm: {
        type: Sequelize.DataTypes.DATE,
      },

      salesPoint: {
        type: Sequelize.DataTypes.INTEGER,
      },

      guarantyCard: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      invAddress: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      clientName: {
        type: Sequelize.DataTypes.STRING,
      },
      clientSurname: {
        type: Sequelize.DataTypes.STRING,
      },
      telephone: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      postCode: {
        type: Sequelize.DataTypes.STRING,
      },
      city: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      postCodeInv: {
        type: Sequelize.DataTypes.STRING,
      },
      cityInv: {
        type: Sequelize.DataTypes.STRING,
      },
      addressInv: {
        type: Sequelize.DataTypes.STRING,
      },
      comment: {
        type: Sequelize.DataTypes.TEXT,
      },
      internalComment: {
        type: Sequelize.DataTypes.TEXT,
      },
      lw: {
        type: Sequelize.DataTypes.STRING,
      },
      zlc: {
        type: Sequelize.DataTypes.STRING,
      },
      amount: {
        type: Sequelize.DataTypes.FLOAT,
      },
      possitionsDescription: {
        type: Sequelize.DataTypes.TEXT,
      },
      oracleId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      sendemail: {
        type: Sequelize.DataTypes.STRING,
      },
      viewId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      numNumber: {
        type: Sequelize.DataTypes.INTEGER,
      },
      recstatusDate: {
        type: Sequelize.DataTypes.DATE,
      },
      recacceptdate: {
        type: Sequelize.DataTypes.DATE,
      },
      recstatusDescription: {
        type: Sequelize.DataTypes.TEXT,
      },
      recstatusDateEndCount: {
        type: Sequelize.DataTypes.DATE,
      },
      reclNew: {
        type: Sequelize.DataTypes.INTEGER,
      },
      decisionDescription: {
        type: Sequelize.DataTypes.TEXT,
      },
      agreementMaxWh: {
        type: Sequelize.DataTypes.INTEGER,
      },
      reclPrinted: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      deliveryPaymentSide: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Fabryka', 'Handlowiec', 'Klient'],
      },
      deliveryStatus: {
        type: Sequelize.DataTypes.ENUM,
        values: ['Przygotowane', 'Wysłane'],
      },
      deliveryDate: {
        type: Sequelize.DataTypes.DATE,
      },
      deliveryNote: {
        type: Sequelize.DataTypes.STRING,
      },
      deliveryAddress: {
        type: Sequelize.DataTypes.STRING,
      },
      deliveryItems: {
        type: Sequelize.DataTypes.TEXT,
      },
      deliveryComment: {
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      deliveryTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'delivery_types',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      docTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_types',
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
      executionTypeId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_executiontypes',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      decisionId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_decisions',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      statusId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_statuses',
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
      responsibleId: {
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
      perpetratorId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_perpetrators',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reclamationReasonId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'reclamation_reasons',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      managerId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'employees',
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable('reclamations', { transaction: t })])
    })
  },
}
