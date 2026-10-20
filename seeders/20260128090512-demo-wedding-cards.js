import fs from "node:fs";
import path from "node:path";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const defaultCards = [
      {
        id: 1,
        name: "Mẫu Thiệp Minimalist",
        meta_desc: "Mẫu thiệp cưới tối giản, hiện đại",
        image_page: "https://example.com/templates/minimalist.jpg",
        avatar: "/others/cinelove-default-thumbnail.jpg",
        url: "mau-thiep-minimalist",
        is_custom_url: false,
        is_public: true,
        is_publish: true,
        views: 500,
        likes: 0,
        height: 1024,
        is_template: false, // Đây là mẫu
        is_template_user: false,
        id_category_wedding_card: 1, // Modern
        id_user: 1,
        id_package: 3,
        music: null,
        nodes: null,
        effect: "none",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Đám Cưới Của Nam & Nữ",
        meta_desc: "Thiệp mời đám cưới của Nam và Nữ",
        image_page: "https://example.com/cards/nam-nu.jpg",
        avatar: "/others/cinelove-default-thumbnail.jpg",
        url: "nam-va-nu",
        is_custom_url: false,
        is_public: true,
        is_publish: true,
        views: 120,
        likes: 0,
        height: 1024,
        is_template: false, // Thiệp thật
        is_template_user: false,
        id_category_wedding_card: 1,
        id_user: 1,
        id_package: 3,
        music: null,
        nodes: null,
        effect: "none",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const cardsToInsert = [];
    const seenUrls = new Set();
    const wcardsDir = path.join(process.cwd(), "seeders", "wcards");

    if (fs.existsSync(wcardsDir)) {
      const files = fs.readdirSync(wcardsDir);

      // Sort files numerically (e.g., 1, 2, 10 instead of 1, 10, 2)
      // to ensure DB auto-increment IDs align with the numbers in filenames
      files.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numA - numB;
      });

      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const content = fs.readFileSync(
              path.join(wcardsDir, file),
              "utf-8",
            );
            const data = JSON.parse(content);

            // Skip if URL is already seen (avoid unique constraint error)
            if (seenUrls.has(data.url)) {
              console.warn(`[Seeder] Skipping duplicate url "${data.url}" from file ${file}`);
              continue;
            }

            // Assign explicit ID from filename if available to keep ID aligned with filename and images
            const fileId = parseInt(file.match(/\d+/)?.[0] || "0");
            if (fileId > 0 && !data.id) {
              data.id = fileId;
            }

            // Ensure JSON fields are stringified for bulkInsert
            if (data.music && typeof data.music === "object")
              data.music = JSON.stringify(data.music);
            if (data.nodes && typeof data.nodes === "object")
              data.nodes = JSON.stringify(data.nodes);
            if (data.effect && typeof data.effect === "object")
              data.effect = JSON.stringify(data.effect);
            if (data.background && typeof data.background === "object")
              data.background = JSON.stringify(data.background);

            // Ensure defaults for required/common fields
            data.views = data.views ?? 0;
            data.likes = data.likes ?? 0;
            data.height = data.height ?? 1024;
            data.is_custom_url = data.is_custom_url ?? false;
            data.is_public = data.is_public ?? true;
            data.is_publish = data.is_publish ?? true;
            data.is_template = data.is_template ?? false;
            data.is_template_user = data.is_template_user ?? false;
            data.avatar = data.avatar || "/others/cinelove-default-thumbnail.jpg";

            // Ensure required date fields for bulkInsert
            data.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
            data.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

            seenUrls.add(data.url);
            cardsToInsert.push(data);
          } catch (e) {
            console.error(`[Seeder] Error parsing ${file}:`, e);
          }
        }
      }
    }

    // Add fallback defaultCards if their url wasn't already loaded from wcards
    for (const card of defaultCards) {
      if (!seenUrls.has(card.url)) {
        seenUrls.add(card.url);
        cardsToInsert.push(card);
      }
    }

    // Sort by id to ensure deterministic order
    cardsToInsert.sort((a, b) => (a.id || 0) - (b.id || 0));

    // Fetch valid foreign keys to prevent FK constraint failures
    const [existingUsers] = await queryInterface.sequelize.query("SELECT id FROM users;");
    const validUserIds = new Set(existingUsers.map((u) => u.id));
    const fallbackUserId = validUserIds.values().next().value || 1;

    const [existingCategories] = await queryInterface.sequelize.query("SELECT id FROM category_wedding_cards;");
    const validCategoryIds = new Set(existingCategories.map((c) => c.id));
    const fallbackCategoryId = validCategoryIds.values().next().value || 1;

    const [existingPackages] = await queryInterface.sequelize.query("SELECT id FROM packages;");
    const validPackageIds = new Set(existingPackages.map((p) => p.id));
    const fallbackPackageId = validPackageIds.values().next().value || 1;

    // Normalize keys across all records for clean bulkInsert
    const normalizedCards = cardsToInsert.map((card) => ({
      id: card.id || null,
      name: card.name,
      meta_desc: card.meta_desc || null,
      image_page: card.image_page || null,
      avatar: card.avatar || "/others/cinelove-default-thumbnail.jpg",
      url: card.url,
      is_custom_url: card.is_custom_url ?? false,
      is_public: card.is_public ?? true,
      is_publish: card.is_publish ?? true,
      qr_code: card.qr_code || null,
      views: card.views ?? 0,
      likes: card.likes ?? 0,
      background: card.background || null,
      height: card.height ?? 1024,
      music: card.music || null,
      effect: card.effect || "none",
      nodes: card.nodes || null,
      is_template: card.is_template ?? false,
      is_template_user: card.is_template_user ?? false,
      id_category_wedding_card: validCategoryIds.has(card.id_category_wedding_card)
        ? card.id_category_wedding_card
        : fallbackCategoryId,
      id_user: validUserIds.has(card.id_user)
        ? card.id_user
        : fallbackUserId,
      id_package: validPackageIds.has(card.id_package)
        ? card.id_package
        : fallbackPackageId,
      createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
      updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
    }));

    if (normalizedCards.length > 0) {
      await queryInterface.bulkInsert("wedding_cards", normalizedCards, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("wedding_cards", null, {});
  },
};
