"use strict";
import fs from "fs";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        name: "Yếu tố đám cưới",
        slug: "yeu-to-dam-cuoi",
        key: "stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nhân vật",
        slug: "nhan-vat",
        key: "stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hoa cưới",
        slug: "hoa-cuoi",
        key: "stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chữ hỷ",
        slug: "chu-hy",
        key: "stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Trái tim",
        slug: "trai-tim",
        key: "stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Backround",
        slug: "backround",
        key: "background-system",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Image",
        slug: "image",
        key: "personal_image",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Admin Image",
        slug: "admin-image",
        key: "admin_image",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Opening Effect Gif",
        slug: "opening-effect-gif",
        key: "opening_effect_gif",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    try {
      const cineloveTypesPath = "./seeders/data/cinelove-categories.json";
      if (fs.existsSync(cineloveTypesPath)) {
        const cineloveTypes = JSON.parse(fs.readFileSync(cineloveTypesPath, "utf-8"));
        
        // Append unique generated categories that aren't already hardcoded above
        const existingSlugs = new Set(data.map(item => item.slug));
        
        for (const type of cineloveTypes) {
           if (!existingSlugs.has(type.slug)) {
             data.push({
               name: type.name,
               slug: type.slug,
               key: "stock",
               createdAt: new Date(),
               updatedAt: new Date()
             });
             existingSlugs.add(type.slug);
           }
        }
      }
    } catch(e) {
      console.log("Error reading cinelove categories:", e);
    }

    await queryInterface.bulkInsert("image_types", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("image_types", null, {});
  },
};
