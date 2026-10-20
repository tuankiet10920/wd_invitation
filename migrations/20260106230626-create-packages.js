"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("packages", {
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
      short_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER, // Có thể dùng INTEGER hoặc STRING, nhưng level thường là cấp độ
        allowNull: false,
      },
      original_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sale_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discount_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_best: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      time_save_card: {
        type: Sequelize.INTEGER, // Đơn vị: tháng
        allowNull: true,
      },
      image_limits: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      number_of_cards: {
        type: Sequelize.INTEGER, // Số lượng thiệp tối đa
        allowNull: true,
      },
      maximum_views: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("packages");
  },
};
