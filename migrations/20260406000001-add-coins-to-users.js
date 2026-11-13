'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('users');
    if (!tableInfo.coins) {
      await queryInterface.addColumn('users', 'coins', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2000,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('users');
    if (tableInfo.coins) {
      await queryInterface.removeColumn('users', 'coins');
    }
  },
};
