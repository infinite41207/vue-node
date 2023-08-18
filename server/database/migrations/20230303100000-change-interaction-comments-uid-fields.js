'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   try { 
   
    await queryInterface.removeColumn('interaction_comments', 'emailAccountId' );
    await queryInterface.addColumn('interaction_comments', 'emailAccountId', {
      type: Sequelize.DataTypes.UUID,
    });

    await queryInterface.removeColumn('interaction_comments', 'emailId' );
    await queryInterface.addColumn('interaction_comments', 'emailId', {
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
