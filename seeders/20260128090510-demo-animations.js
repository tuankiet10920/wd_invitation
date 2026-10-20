"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "animations",
      [
        {
          name: "Falling Hearts",
          id_animation_type: 3, // Heart Beat / Effect
          id_user: 1,
          id_min_package: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gold Sparkles",
          id_animation_type: 4, // Confetti
          id_user: 1,
          id_min_package: 2, // Pro
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("animations", null, {});
  },
};
