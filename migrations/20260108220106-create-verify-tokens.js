"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("verify_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false, // Token không được để trống
      },
      // Bổ sung trường type để phân biệt loại xác thực
      type: {
        type: Sequelize.ENUM("VERIFY_ACCOUNT", "RESET_PASSWORD"),
        allowNull: false,
        defaultValue: "VERIFY_ACCOUNT",
      },
      // Bổ sung thời gian hết hạn của token
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // Bổ sung khóa ngoại nối với bảng users
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Tên bảng users trong DB của bạn
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Thêm index cho token để tìm kiếm nhanh hơn khi xác thực
    await queryInterface.addIndex("verify_tokens", ["token"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("verify_tokens");
  },
};
