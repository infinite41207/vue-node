'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scale_protocols', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(50),
		allowNull: false,
		index: true
      },
	  type: {
		type: Sequelize.DataTypes.ENUM('Mechanical', 'IoT', 'TCP/IP', 'Modbus', 'COM'),
          defaultValue: 'IoT',
	  },
      server: {
        type: Sequelize.DataTypes.STRING(20),
      },
      port: {
        type: Sequelize.DataTypes.INTEGER,
      },
	  api:{
		type: Sequelize.DataTypes.STRING(50),
	  },
      command: {
        type: Sequelize.DataTypes.STRING(20),
      },
	  register: {
		type: Sequelize.DataTypes.INTEGER,
	  },
      serialPort: {
        type: Sequelize.DataTypes.STRING(20),
      },
      parserType: {
        type: Sequelize.DataTypes.ENUM('ToledoSimple', 'ToledoSimpleTwice', 'ToledoModbus'),
      },
	  markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
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
    })
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('scale_protocols') 
  }
};
