"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    try {
      // 1. Get all features with type = 'packages'
      const features = await queryInterface.sequelize.query(
        "SELECT id FROM features WHERE type = 'packages'",
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      // 2. Get all packages
      const packages = await queryInterface.sequelize.query(
        "SELECT id FROM packages",
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      if (!features.length || !packages.length) {
        console.log("No features or packages found to seed.");
        return;
      }

      // 3. Generate combinations
      const packageFeatures = [];
      const now = new Date();

      packages.forEach((pkg) => {
        features.forEach((feat) => {
          const rand = Math.floor(Math.random() * 100);
          packageFeatures.push({
            id_package: pkg.id,
            id_feature: feat.id,
            status: rand % 2 == 0,
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
