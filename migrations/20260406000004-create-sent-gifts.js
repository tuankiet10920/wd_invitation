'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sent_gifts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      id_sender_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      sender_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sender_avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      id_gift: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'gifts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      gift_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      gift_price_coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gift_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      gift_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      amount_vnd: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      id_wedding_card: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'wedding_cards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      wedding_card_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      id_recipient_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('sent_gifts');
  },
};
