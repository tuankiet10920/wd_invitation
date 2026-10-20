"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tags = [
      { name: "trò chơi troll", slug: "tro-choi-troll" },
      { name: "vui nhộn", slug: "vui-nhon" },
      { name: "crush", slug: "crush" },
      { name: "tùy chỉnh", slug: "tuy-chinh" },
      { name: "chia sẻ", slug: "chia-se" },
      { name: "xin lỗi", slug: "xin-loi" },
      { name: "thư tình", slug: "thu-tinh" },
      { name: "kawaii", slug: "kawaii" },
      { name: "đáng yêu", slug: "dang-yeu" },
      { name: "tương tác", slug: "tuong-tac" },
      { name: "lãng mạn", slug: "lang-man" },
      { name: "sinh nhật", slug: "sinh-nhat" },
      { name: "bánh sinh nhật", slug: "banh-sinh-nhat" },
      { name: "nến thổi", slug: "nen-thoi" },
      { name: "confetti", slug: "confetti" },
      { name: "âm thanh", slug: "am-thanh" },
      { name: "thổi nến online", slug: "thoi-nen-online" },
    ];

    const data = tags.map((tag) => ({
      ...tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("tags", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tags", null, {});
  },
};
