"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "articles",
      [
        {
          title_vi: "Hướng dẫn tạo thiệp cưới online",
          slug_vi: "huong-dan-tao-thiep-cuoi-online",
          short_description_vi: "Bài viết này sẽ hướng dẫn bạn từng bước để tạo một chiếc thiệp cưới online tuyệt đẹp.",
          content_vi: "<p>Nội dung chi tiết hướng dẫn...</p>",
          keyword: "thiệp cưới, thiệp online, hướng dẫn",
          alt: "Hình ảnh nền thiệp cưới online cao cấp",
          id_type_news: 3, // Hướng dẫn
          id_user: 1,
          num: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title_vi: "Xu hướng thiệp cưới 2026",
          slug_vi: "xu-huong-thiep-cuoi-2026",
          short_description_vi: "Khám phá các mẫu thiệp cưới đang hot nhất năm 2026.",
          content_vi: "<p>Nội dung chi tiết xu hướng...</p>",
          keyword: "xu hướng, thiệp cưới đẹp, 2026",
          alt: "Xu hướng thiệp cưới năm 2026 cực hot",
          id_type_news: 1, // Tin tức
          id_user: 1,
          num: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles", null, {});
  },
};
