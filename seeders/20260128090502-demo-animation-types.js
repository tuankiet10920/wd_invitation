"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "animation_types",
      [
        { name: "Fade In", createdAt: new Date(), updatedAt: new Date() },
        { name: "Slide Up", createdAt: new Date(), updatedAt: new Date() },
        { name: "Heart Beat", createdAt: new Date(), updatedAt: new Date() },
        { name: "Confetti", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("animation_types", null, {});
  },
};
