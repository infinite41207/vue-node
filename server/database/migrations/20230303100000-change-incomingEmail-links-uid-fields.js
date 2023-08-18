'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   try { 
    await queryInterface.removeColumn('incoming_email_links', 'emailAccountId' );
    await queryInterface.addColumn('incoming_email_links', 'emailAccountId', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: {
          tableName: 'email_accounts',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    });

    await queryInterface.removeColumn('incoming_email_links', 'emailId' );
    await queryInterface.addColumn('incoming_email_links', 'emailId', {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: {
          tableName: 'incoming_emails',
        },
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.removeColumn('incoming_email_links', 'documentId' );
    await queryInterface.addColumn('incoming_email_links', 'documentId', {
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
