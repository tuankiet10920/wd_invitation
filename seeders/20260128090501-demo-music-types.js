"use strict";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const musicTypes = [
      { name: "Nhạc ngoại", slug: "nhac-ngoai", key: "general", createdAt: new Date(), updatedAt: new Date() },
      { name: "V-POP", slug: "v-pop", key: "general", createdAt: new Date(), updatedAt: new Date() },
      { name: "Cá nhân", slug: "ca-nhan", key: "personal", createdAt: new Date(), updatedAt: new Date() },
    ];

    // Load cloned types if available
    const dataPath = path.join(__dirname, "data", "musics_cloned.json");
    if (fs.existsSync(dataPath)) {
      try {
        const clonedData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        if (clonedData.musicTypes && Array.isArray(clonedData.musicTypes)) {
          for (const type of clonedData.musicTypes) {
            if (!musicTypes.some(t => t.slug === type.slug)) {
              musicTypes.push({
                ...type,
                key: "general",
                createdAt: type.createdAt ? new Date(type.createdAt) : new Date(),
                updatedAt: type.updatedAt ? new Date(type.updatedAt) : new Date(),
              });
            }
          }
        }
      } catch (e) {
        console.error("Failed to load cloned music types seeder data", e);
      }
    }

    await queryInterface.bulkInsert("music_types", musicTypes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("music_types", null, {});
  },
};
