"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const gifts = [
      { name: 'Bắn tim', price: 520, file: 'biubiu.bin', image: 'biubiu.png', background: 'biubiu.png' },
      { name: 'Hoa anh đào', price: 1180, file: 'petal.bin', image: 'petal.png', background: 'petal.png' },
      { name: 'Khoá tình yêu', price: 1314, file: 'two-hearts-locked.bin', image: 'two-hearts-locked.png', background: 'two-hearts-locked.png' },
      { name: 'Bánh ngọt', price: 1580, file: 'sweet-cake.bin', image: 'sweet-cake.png', background: 'sweet-cake.png' },
      { name: 'Trái tim', price: 1580, file: 'two-hearts.bin', image: 'two-hearts.png', background: 'two-hearts.png' },
      { name: 'Pháo mừng', price: 1980, file: 'cannon.bin', image: 'cannon.png', background: 'cannon.png' },
      { name: 'Pháo hoa mừng', price: 1980, file: 'fireworks.bin', image: 'fireworks.png', background: 'fireworks.png' },
      { name: 'Hoa gấu bông', price: 2020, file: 'rabbit-flower.bin', image: 'rabbit-flower.png', background: 'rabbit-flower.png' },
      { name: 'Em bé vàng', price: 2500, file: 'baby-gold.bin', image: 'baby-gold.png', background: 'baby-gold.png' },
      { name: 'Rượu mừng', price: 3000, file: 'happy-wine.bin', image: 'happy-wine.png', background: 'happy-wine.png' },
      { name: 'Lì xì', price: 888, file: 'lixi.bin', image: 'lixi.png', background: 'lixi.png' },
      { name: 'Bình sữa', price: 500, file: 'milk-bottle.bin', image: 'milk-bottle.png', background: 'milk-bottle.png' }
    ].map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert("gifts", gifts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("gifts", null, {});
  },
};
