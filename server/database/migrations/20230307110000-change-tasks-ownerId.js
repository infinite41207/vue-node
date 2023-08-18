'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   try { 

    await queryInterface.removeColumn('tasks', 'ownerId' );
    await queryInterface.addColumn('tasks', 'ownerId', {
      type: Sequelize.DataTypes.UUID,      
    });

  } catch (err) {
    throw err
  }
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
