'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('qr_boxes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      name_reveive: {
        type: Sequelize.STRING
      },
      name_bank: {
        type: Sequelize.STRING
      },
      number_bank: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      id_wedding_card: {
        type: Sequelize.INTEGER,
        references: {
          model: 'wedding_cards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('qr_boxes');
  }
};
