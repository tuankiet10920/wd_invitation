"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invitors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_confirm: {
        type: Sequelize.ENUM("not_yet", "confirmed", "refuse"),
        defaultValue: "not_yet",
      },
      is_send: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastest_view_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_card: {
        type: Sequelize.INTEGER,
        references: {
          model: "wedding_cards",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invitors");
  },
};
