"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "packages",
      [
        {
          name: "Free",
          short_description: "Gói miễn phí cơ bản để trải nghiệm",
          level: 1,
          original_price: 0,
          sale_price: 0,
          is_best: false,
          time_save_card: 3, // 3 tháng
          image_limits: 5,
          number_of_cards: 1,
          maximum_views: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Basic",
          short_description: "Phù hợp cho nhu cầu tiệc cưới đơn giản",
          level: 2,
          original_price: 200000,
          sale_price: 150000,
          is_best: false,
          time_save_card: 6, // 6 tháng
          image_limits: 20,
          number_of_cards: 2,
          maximum_views: 10000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Premium",
          short_description: "Đầy đủ tính năng cao cấp và không giới hạn",
          level: 3,
          original_price: 500000,
          sale_price: 399000,
          is_best: true, // Thường gói cao nhất sẽ là Best Seller
          time_save_card: 12, // 12 tháng
          image_limits: 50,
          number_of_cards: 5,
          maximum_views: 100000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Xóa toàn bộ dữ liệu trong bảng packages khi rollback seeder
    await queryInterface.bulkDelete("packages", null, {});
  },
};
