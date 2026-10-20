"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("effects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      icon: {
        type: Sequelize.STRING,
      },
      icon_type: {
        type: Sequelize.STRING,
      },
      icons: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      id_type_effect: {
        type: Sequelize.INTEGER,
        references: {
          model: "effect_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      id_min_package: {
        type: Sequelize.INTEGER,
      },
      image_left: {
        type: Sequelize.STRING,
      },
      image_right: {
        type: Sequelize.STRING,
      },
      video: {
        type: Sequelize.STRING,
      },
      is_custom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("effects");
  },
};