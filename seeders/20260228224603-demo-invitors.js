"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const data = [];
    if (data.length > 0) await queryInterface.bulkInsert("invitors", [], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("invitors", null, {});
  },
};
