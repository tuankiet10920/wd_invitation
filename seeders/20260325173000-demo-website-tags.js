"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Get Websites to Map IDs
    const websites = await queryInterface.sequelize.query(
      `SELECT id, title FROM websites;`
    );
    const websiteRows = websites[0];
    const getWebsiteId = (title) => websiteRows.find(w => w.title === title)?.id;

    // 2. Get Tags to Map IDs
    const tags = await queryInterface.sequelize.query(
      `SELECT id, slug FROM tags;`
    );
    const tagRows = tags[0];
    const getTagId = (slug) => tagRows.find(t => t.slug === slug)?.id;

    const mapping = [];

    // Mapping for Crush Killer
    const idCrushKiller = getWebsiteId("Crush Killer");
    if (idCrushKiller) {
      ["tro-choi-troll", "vui-nhon", "crush", "tuy-chinh", "chia-se"].forEach(slug => {
        const tid = getTagId(slug);
        if (tid) mapping.push({ id_website: idCrushKiller, id_tag: tid, createdAt: new Date(), updatedAt: new Date() });
      });
    }

    // Mapping for Thư Xin Lỗi Đáng Yêu
    const idThuXinLoi = getWebsiteId("Thư Xin Lỗi Đáng Yêu");
    if (idThuXinLoi) {
      ["xin-loi", "thu-tinh", "kawaii", "dang-yeu", "tuong-tac", "lang-man"].forEach(slug => {
        const tid = getTagId(slug);
        if (tid) mapping.push({ id_website: idThuXinLoi, id_tag: tid, createdAt: new Date(), updatedAt: new Date() });
      });
    }

    // Mapping for Happy Birthday
    const idHappyBirthday = getWebsiteId("Happy Birthday");
    if (idHappyBirthday) {
      ["sinh-nhat", "banh-sinh-nhat", "nen-thoi", "confetti", "tuong-tac", "am-thanh", "lang-man", "thoi-nen-online"].forEach(slug => {
        const tid = getTagId(slug);
        if (tid) mapping.push({ id_website: idHappyBirthday, id_tag: tid, createdAt: new Date(), updatedAt: new Date() });
      });
    }

    if (mapping.length > 0) {
      await queryInterface.bulkInsert("website_tags", mapping, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("website_tags", null, {});
  },
};
