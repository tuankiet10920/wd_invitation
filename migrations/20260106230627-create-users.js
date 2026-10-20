"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "default.jpg",
      },
      birthday: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      introduction: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_google: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verify_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      social: {
        type: Sequelize.ENUM("normal", "facebook", "google"), // varchar(255)
        allowNull: false,
        defaultValue: "normal",
      },
      facebook_user_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      package_expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_change_image: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_package: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "packages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      // Các trường hệ thống tự động của Sequelize
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
