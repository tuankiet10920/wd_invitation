import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const dataPath = path.join(__dirname, "data", "fonts_cloned.json");
    if (!fs.existsSync(dataPath)) return;

    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const formatDate = (date) => {
      if (!date) return new Date().toISOString().slice(0, 19).replace("T", " ");
      return new Date(date).toISOString().slice(0, 19).replace("T", " ");
    };

    if (data.fontTypes && data.fontTypes.length > 0) {
      const typesToInsert = data.fontTypes.map((t) => ({
        ...t,
        createdAt: formatDate(t.createdAt),
        updatedAt: formatDate(t.updatedAt),
      }));
      await queryInterface.bulkInsert("font_types", typesToInsert, {});
    }

    if (data.fonts && data.fonts.length > 0) {
      const [fontTypes] = await queryInterface.sequelize.query(
        "SELECT id, slug FROM font_types",
      );
      const typeMap = {};
      fontTypes.forEach((t) => (typeMap[t.slug] = t.id));

      const fontsToInsert = data.fonts.map((f) => ({
        name: f.name,
        slug: f.slug,
        id_font_type: typeMap[f.id_font_type_slug] || null,
        path: f.path,
        image: f.image,
        createdAt: formatDate(f.createdAt),
        updatedAt: formatDate(f.updatedAt),
      }));

      await queryInterface.bulkInsert("fonts", fontsToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("fonts", null, {});
    await queryInterface.bulkDelete("font_types", null, {});
  },
};
