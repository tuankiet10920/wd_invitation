import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const musics = [
      {
        url: "years.mp3",
        name: "50 Năm Về Sau - điệp khúc",
        slug: "50-nam-ve-sau",
        duration: 234,
        id_music_type: 2,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "little-love.mp3",
        name: "A Little Love",
        slug: "a-little-love",
        duration: 191,
        id_music_type: 1,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "thousand.mp3",
        name: "A Thousand Years",
        slug: "a-thousand-years",
        duration: 288,
        id_music_type: 1,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "allme.mp3",
        name: "All of Me",
        slug: "all-of-me",
        duration: 270,
        id_music_type: 1,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "always.mp3",
        name: "Always",
        slug: "always",
        duration: 205,
        id_music_type: 1,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "anh-nang-cua-anh.mp3",
        name: "Ánh Nắng Của Anh",
        slug: "anh-nang-cua-anh",
        duration: 264,
        id_music_type: 2,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "ba-ke-con-nghe.mp3",
        name: "Ba kể con nghe",
        slug: "ba-ke-con-nghe",
        duration: 379,
        id_music_type: 2,
        id_user: null,
        id_min_package: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Load cloned musics if available
    const dataPath = path.join(__dirname, "data", "musics_cloned.json");
    if (fs.existsSync(dataPath)) {
      try {
        const clonedData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        
        if (clonedData.musics && Array.isArray(clonedData.musics)) {
          // Map type slugs to actual IDs
          const [musicTypes] = await queryInterface.sequelize.query("SELECT id, slug FROM music_types");
          const typeMap = {};
          musicTypes.forEach(t => typeMap[t.slug] = t.id);

          for (const music of clonedData.musics) {
            if (!musics.some(m => m.slug === music.slug)) {
              musics.push({
                url: music.url,
                name: music.name,
                slug: music.slug,
                duration: music.duration,
                id_music_type: typeMap[music.typeSlug] || null,
                id_user: music.id_user,
                id_min_package: music.id_min_package,
                createdAt: music.createdAt ? new Date(music.createdAt) : new Date(),
                updatedAt: music.updatedAt ? new Date(music.updatedAt) : new Date(),
              });
            }
          }
        }
      } catch (e) {
        console.error("Failed to load cloned music seeder data", e);
      }
    }

    await queryInterface.bulkInsert("musics", musics, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("musics", null, {});
  },
};
