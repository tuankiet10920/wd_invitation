"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "seo_pages",
      [
        {
          name: "Trang chủ",
          slug: "trang-chu",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Tạo Thiệp Cưới Online Cực Đẹp Nhanh Chóng",
          description:
            "Hệ thống tạo thiệp cưới online cao cấp, chuẩn SEO, có tính năng gửi và quản lý khách mời thông minh.",
          priority: 1.0,
          change_freq: "daily",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mẫu thiệp",
          slug: "mau-thiep",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Khám Phá Hàng Trăm Mẫu Thiệp Cưới Online Siêu Hot",
          description:
            "Thư viện mẫu thiệp cưới đang được yêu thích nhất. Đa dạng phong cách từ truyền thống đến hiện đại.",
          priority: 0.8,
          change_freq: "weekly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Thiệp đã tạo",
          slug: "thiep-da-tao",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Danh Sách Thiệp Cưới Đã Tạo Bởi Khách Hàng",
          description:
            "Tham khảo những mẫu thiệp cưới tuyệt đẹp đã được khách hàng tự tay thiết kế và tạo trên hệ thống.",
          priority: 0.7,
          change_freq: "daily",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gói dịch vụ",
          slug: "goi-dich-vu",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Các Gói Dịch Vụ Tạo Thiệp Cưới Online Cực Ưu Đãi",
          description:
            "Bảng giá và thông tin chi tiết các gói dịch vụ tạo thiệp cưới online. Phù hợp với mọi nhu cầu.",
          priority: 0.8,
          change_freq: "monthly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Liên hệ",
          slug: "lien-he",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Liên Hệ Với Chúng Tôi - Hỗ Trợ Tạo Thiệp Cưới Online",
          description:
            "Bạn cần hỗ trợ hoặc có thắc mắc? Đừng ngần ngại liên hệ với chúng tôi để được tư vấn nhanh nhất.",
          priority: 0.6,
          change_freq: "yearly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tạo thiệp trọn gói",
          slug: "tao-thiep-tron-goi",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Dịch Vụ Tạo Thiệp Cưới Trọn Gói Cao Cấp",
          description:
            "Chúng tôi cung cấp dịch vụ thiết kế và tạo thiệp cưới trọn gói, giúp bạn có một ngày trọng đại hoàn hảo.",
          priority: 0.8,
          change_freq: "monthly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bài viết",
          slug: "bai-viet",
          image: "/others/cinelove-default-thumbnail.jpg",
          title: "Tin Tức & Kinh Nghiệm Cưới Hỏi - Blog Thiệp Cưới",
          description:
            "Tổng hợp những bài viết, tin tức và kinh nghiệm hữu ích về cưới hỏi, xu hướng thiệp cưới mới nhất.",
          priority: 0.7,
          change_freq: "weekly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("seo_pages", null, {});
  },
};
