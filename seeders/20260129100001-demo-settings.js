"use strict";

export default {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("settings", [
      {
        key: "site_logo",
        value: "/images/logo.png",
        description: "Logo của website",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "google_client_id",
        value:
          "1014406767384-5qir0int7qg3kb3aush8savqrvpfds66.apps.googleusercontent.com",
        description: "Google ID",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "google_client_secret",
        value: "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",
        description: "Google Secret",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "facebook_client_id",
        value: "1238638101738706",
        description: "Facebook ID",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "facebook_client_secret",
        value: "eba3192729134cfb3716b83d298c2680",
        description: "Facebook Secret",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "google_analytics_id",
        value: "G-8TZ15FNY4J",
        description: "Mã định danh của Google Analytics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "token_imgur",
        value: "Not set",
        description: "Token để sử dụng hình ảnh từ bên thứ 3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "facebook_link",
        value: "https://facebook.com",
        description: "Facebook Fanpage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "instagram_link",
        value: "https://instagram.com",
        description: "Instagram Link",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "tiktok_link",
        value: "https://tiktok.com",
        description: "Tiktok Channel",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("settings", null, {});
  },
};
