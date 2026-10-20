"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("websites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meta_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      time_creator: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_new: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_hot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      id_website_type: {
        type: Sequelize.INTEGER,
        references: {
          model: "website_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_package: {
        type: Sequelize.INTEGER,
        references: {
          model: "packages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
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
    await queryInterface.dropTable("websites");
  },
};
