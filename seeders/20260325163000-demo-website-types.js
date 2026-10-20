"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("website_types", [
      {
        name: "Trò chơi Troll",
        slug: "tro-choi-troll",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tình yêu & Xin lỗi",
        slug: "tinh-yeu-xin-loi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sinh nhật",
        slug: "sinh-nhat",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("website_types", null, {});
  },
};
