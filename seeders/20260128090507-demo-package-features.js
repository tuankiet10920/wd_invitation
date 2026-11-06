"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    try {
      // 1. Get all features with type = 'packages'
      const features = await queryInterface.sequelize.query(
        "SELECT id, key_feature FROM features WHERE type = 'packages' ORDER BY `order` ASC, id ASC",
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      // 2. Get all packages
      const packages = await queryInterface.sequelize.query(
        "SELECT id, name, level FROM packages ORDER BY level ASC, id ASC",
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      if (!features.length || !packages.length) {
        console.log("No features or packages found to seed.");
        return;
      }

      // Features enabled for Free (level 1)
      const freeFeatureKeys = new Set([
        "website_builder",
        "custom_gift_box",
        "bank_qr",
        "common_music_library",
      ]);

      // Features enabled for Basic (level 2): all of Free + a few more
      const basicFeatureKeys = new Set([
        ...freeFeatureKeys,
        "remove_watermark",
        "basic_templates",
        "envelope_effect",
        "add_hyperlinks",
        "auto_guest_names",
      ]);

      // 3. Generate combinations (Premium level >= 3 gets all features)
      const packageFeatures = [];
      const now = new Date();

      packages.forEach((pkg) => {
        const level = Number(pkg.level) || 1;
        const nameLower = String(pkg.name || "").toLowerCase();

        features.forEach((feat) => {
          let isEnabled = false;

          if (level >= 3 || nameLower === "premium") {
            isEnabled = true;
          } else if (level === 2 || nameLower === "basic") {
            isEnabled = basicFeatureKeys.has(feat.key_feature);
          } else {
            isEnabled = freeFeatureKeys.has(feat.key_feature);
          }

          packageFeatures.push({
            id_package: pkg.id,
            id_feature: feat.id,
            status: isEnabled,
            createdAt: now,
            updatedAt: now,
          });
        });
      });

      // 4. Bulk insert
      if (packageFeatures.length > 0) {
        await queryInterface.bulkInsert(
          "package_features",
          packageFeatures,
          {},
        );
      }
    } catch (error) {
      console.error("Seeding package_features failed:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("package_features", null, {});
  },
};
