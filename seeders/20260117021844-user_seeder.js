"use strict";
import bcrypt from "bcrypt";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("@Kiet2020", salt);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Nguyễn Văn Admin",
          avatar: "default-avatar.png",
          birthday: "1995-05-20",
          email: "admin@thiepcuoi.com",
          password: hashedPassword,
          phone: "0901234567",
          introduction: "Quản trị viên hệ thống Cinelove.",
          is_google: false,
          verify_at: new Date(),
          social: "normal",
          facebook_user_id: null,
          is_active: true,
          is_change_image: false,
          role: "admin",
          package_expired_at: new Date(
            new Date().setFullYear(new Date().getFullYear() + 500),
          ), // far future
          id_package: 1, // Assuming package 1 exists
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "kiet nguyen",
          avatar: "default-avatar.png",
          birthday: "2002-11-02",
          email: "kietnguyen02112002@gmail.com",
          password: hashedPassword,
          phone: "0398765432",
          introduction: "Người dùng yêu thích thiệp online.",
          is_google: true,
          verify_at: new Date(),
          social: "normal",
          facebook_user_id: "fb_123456789",
          is_active: true,
          is_change_image: false,
          role: "user",
          package_expired_at: new Date(
            new Date().setFullYear(new Date().getFullYear() + 500),
          ), // far future
          id_package: 1, // Assuming package 1 exists
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Xóa toàn bộ dữ liệu trong bảng users khi revert seed
    await queryInterface.bulkDelete("users", null, {});
  },
};
