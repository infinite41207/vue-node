"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      login: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        index: true,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      markedToDelete: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      language: {
        type: Sequelize.DataTypes.STRING(2),
      },
      isConstructor: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      fullRights: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      externalUser: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      abbreviation: {
        type: Sequelize.DataTypes.STRING(10),
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      useCustomerAccess: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      accessFiles: {
        type: Sequelize.DataTypes.STRING,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      referralToken: {
        type: Sequelize.DataTypes.STRING,
      },
      emailConfirmationToken: {
        type: Sequelize.DataTypes.STRING,
      },
      passwordResetToken: {
        type: Sequelize.DataTypes.STRING,
      },
      passwordResetExpires: {
        type: Sequelize.DataTypes.DATE,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.Sequelize.transaction((t) => {
      return Promise.all([queryInterface.dropTable("users", { transaction: t })]);
    });
  },
};
