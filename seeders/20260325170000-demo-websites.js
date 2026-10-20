"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Seed Websites
    await queryInterface.bulkInsert("websites", [
      {
        title: "Crush Killer",
        slug: "crush-killer",
        key: "CrushKiller",
        desc: "Crush Killer là trò chơi troll cực kỳ vui nhộn để 'trêu' crush hoặc bạn bè. Khi họ cố gắng bấm 'Không', nút sẽ liên tục trốn tránh một cách hài hước.",
        meta_desc: "Trò chơi troll crush cực đỉnh với nút bấm trốn tránh.",
        level: 1, // Rất dễ
        time_creator: new Date(),
        features: JSON.stringify([
          "Trò chơi troll với nút bấm trốn tránh",
          "Tùy chỉnh toàn bộ câu hỏi và hình ảnh",
          "Âm thanh vui nhộn và bất ngờ",
        ]),
        image: "/images/websites/crush-killer-1.webp",
        is_new: false,
        is_hot: true,
        id_website_type: 1,
        id_user: 1,
        id_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Thư Xin Lỗi Đáng Yêu",
        slug: "thu-xin-loi-dang-yeu",
        key: "ThuXinLoi",
        desc: "Thư Xin Lỗi Đáng Yêu là website tương tác siêu cute để gửi lời xin lỗi chân thành đến người yêu với phong cách kawaii và hiệu ứng sparkle.",
        meta_desc: "Website xin lỗi người yêu phong cách kawaii đáng yêu.",
        level: 2, // Dễ sử dụng
        time_creator: new Date(),
        features: JSON.stringify([
          "Thiết kế kawaii style cực kỳ đáng yêu",
          "Hiệu ứng sparkle và confetti lãng mạn",
          "Hành trình dẫn dắt cảm xúc chân thành",
        ]),
        image: "/images/websites/thu-xin-loi-dang-yeu-1.webp",
        is_new: true,
        is_hot: true,
        id_website_type: 2,
        id_user: 1,
        id_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Happy Birthday",
        slug: "happy-birthday",
        key: "HappyBirthday",
        desc: "Happy Birthday là website sinh nhật tương tác cực kỳ thú vị. Người dùng có thể thổi nến online và nhận lời chúc với hiệu ứng confetti và nhạc nền.",
        meta_desc: "Tạo website chúc mừng sinh nhật online tương tác thổi nến.",
        level: 2, // Dễ sử dụng
        time_creator: new Date(),
        features: JSON.stringify([
          "Tính năng thổi nến online tương tác",
          "Hiệu ứng confetti bùng nổ khi nến tắt",
          "Âm thanh nhạc sinh nhật và hiệu ứng typing",
        ]),
        image: "/images/websites/happy-birthday-1.webp",
        is_new: true,
        is_hot: false,
        id_website_type: 3,
        id_user: 1,
        id_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Seed Website Images
    await queryInterface.bulkInsert("website_images", [
      // Crush Killer
      {
        id_website: 1,
        url: "/images/websites/crush-killer-1.webp",
        is_main: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 1,
        url: "/images/websites/crush-killer-2.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 1,
        url: "/images/websites/crush-killer-3.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Thư Xin Lỗi
      {
        id_website: 2,
        url: "/images/websites/thu-xin-loi-dang-yeu-1.webp",
        is_main: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 2,
        url: "/images/websites/thu-xin-loi-dang-yeu-2.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 2,
        url: "/images/websites/thu-xin-loi-dang-yeu-3.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Happy Birthday
      {
        id_website: 3,
        url: "/images/websites/happy-birthday-1.webp",
        is_main: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 3,
        url: "/images/websites/happy-birthday-2.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_website: 3,
        url: "/images/websites/happy-birthday-3.webp",
        is_main: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("website_images", null, {});
    await queryInterface.bulkDelete("websites", null, {});
  },
};
