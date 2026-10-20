export default defineEventHandler(async (event) => {
  try {
    // 1. Truy cập đối tượng db chứa Models từ biến toàn cục
    // Nuxt/Nitro chỉ định biến toàn cục qua global
    const db = global.__db;

    if (!db || !db.User) {
      // Trường hợp lỗi: Models chưa được tải hoặc bị lỗi khởi tạo
      throw new Error("Database models not initialized or User model missing.");
    }

    // 2. Gọi Model (sử dụng tên Model đã định nghĩa, ví dụ: 'User')
    const User = db.User;

    // 3. Thực hiện truy vấn (ví dụ: findAll để lấy tất cả user)
    const users = await User.findAll({
      // Các tùy chọn Sequelize:
      order: [["createdAt", "DESC"]],
    });

    // 4. Trả về dữ liệu JSON
    return {
      status: "success",
      data: users,
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);

    // Trả về lỗi 500 nếu có vấn đề về database
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: "Failed to fetch user data.",
      details: error.message,
    };
  }
});
