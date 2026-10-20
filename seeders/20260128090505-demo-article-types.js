"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "article_types",
      [
        {
          name_vi: "Tin tức",
          type: "posts",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name_vi: "Khuyến mãi",
          type: "posts",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name_vi: "Hướng dẫn",
          type: "posts",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("article_types", null, {});
  },
};
