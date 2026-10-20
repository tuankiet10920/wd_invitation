"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wedding_cards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta_desc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image_page: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "/others/cinelove-default-thumbnail.jpg",
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // URL của thiệp thường là unique
      },
      is_custom_url: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_publish: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      background: {
        type: Sequelize.STRING, // hoặc JSON nếu lưu config
        allowNull: true,
      },
      height: {
        type: Sequelize.INTEGER,
        defaultValue: 1024,
      },
      music: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      effect: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      nodes: {
        type: Sequelize.JSON, // Lưu cấu trúc thiệp dưới dạng JSON
        allowNull: true,
      },
      is_template: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_template_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      id_category_wedding_card: {
        type: Sequelize.INTEGER,
        references: {
          model: "category_wedding_cards",
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
    await queryInterface.dropTable("wedding_cards");
  },
};
