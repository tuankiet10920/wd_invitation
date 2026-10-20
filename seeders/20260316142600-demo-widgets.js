"use strict";

export default {
  async up(queryInterface, Sequelize) {
    const widgets = [
      {
        name: "Lịch",
        slug: "lich",
        key: "Calendar",
        icon: "calendar-month",
        icon_type: "mdi",
        color: "#ec4899",
        id_min_package: 1,
      },
      {
        name: "Đếm ngược",
        slug: "dem-nguoc",
        key: "Countdown",
        icon: "timer-outline",
        icon_type: "mdi",
        color: "#ef4444",
        id_min_package: 1,
      },
      {
        name: "Bản đồ",
        slug: "ban-do",
        key: "Map",
        icon: "map-marker-radius",
        icon_type: "mdi",
        color: "#10b981",
        id_min_package: 1,
      },
      {
        name: "Nút gọi",
        slug: "nut-goi",
        key: "Call",
        icon: "phone",
        icon_type: "mdi",
        color: "#f43f5e",
        id_min_package: 1,
      },
      {
        name: "Form xác nhận tham dự",
        slug: "form-xac-nhan-tham-du",
        key: "Attend",
        icon: "clipboard-list-outline",
        icon_type: "mdi",
        color: "#3b82f6",
        id_min_package: 1,
      },
      {
        name: "Tên khách mời tự động",
        slug: "ten-khach-moi-tu-dong",
        key: "GuestName",
        icon: "rename-box",
        icon_type: "mdi",
        color: "#f59e0b",
        id_min_package: 2,
      },
      {
        name: "QR Box",
        slug: "qr-box",
        key: "QrBox",
        icon: "qrcode",
        icon_type: "mdi",
        color: "#8b5cf6",
        id_min_package: 2,
      },
      {
        name: "Hiệu ứng phong bì thư",
        slug: "hieu-ung-phong-bi-thu",
        key: "Envelope",
        icon: "email-open-outline",
        icon_type: "mdi",
        color: "#f472b6",
        id_min_package: 2,
      },
      {
        name: "Album ảnh",
        slug: "album-anh",
        key: "PhotoAlbum",
        icon: "image-album",
        icon_type: "mdi",
        color: "#06b6d4",
        id_min_package: 2,
      },
      {
        name: "Video YouTube",
        slug: "video-youtube",
        key: "Youtube",
        icon: "youtube",
        icon_type: "mdi",
        color: "#ef4444",
        id_min_package: 2,
      }
    ];

    await queryInterface.bulkInsert("widgets", widgets, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("widgets", null, {});
  },
};
