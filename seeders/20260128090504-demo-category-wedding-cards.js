"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "category_wedding_cards",
      [
        { name: "Thiệp cưới", createdAt: new Date(), updatedAt: new Date() },
        { name: "Thiệp sinh nhật", createdAt: new Date(), updatedAt: new Date() },
        { name: "Thiệp tốt nghiệp", createdAt: new Date(), updatedAt: new Date() },
        { name: "Sự kiện", createdAt: new Date(), updatedAt: new Date() },
        { name: "Kỷ niệm", createdAt: new Date(), updatedAt: new Date() },
        { name: "Lời chúc", createdAt: new Date(), updatedAt: new Date() },
        { name: "Khác", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category_wedding_cards", null, {});
  },
};
