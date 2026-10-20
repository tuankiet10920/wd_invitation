"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      num: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      title_vi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug_vi: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      short_description_vi: {
        type: Sequelize.TEXT, 
      },
      content_vi: {
        type: Sequelize.TEXT("long"), // Nội dung bài viết có thể dài
      },
      keyword: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      alt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_type_news: {
        type: Sequelize.INTEGER,
        references: {
          model: "article_types",
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
    await queryInterface.dropTable("articles");
  },
};
