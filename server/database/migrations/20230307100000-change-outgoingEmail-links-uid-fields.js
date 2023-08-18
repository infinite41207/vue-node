'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   try { 

    await queryInterface.removeColumn('outgoing_email_links', 'documentId' );
    await queryInterface.addColumn('outgoing_email_links', 'documentId', {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
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
