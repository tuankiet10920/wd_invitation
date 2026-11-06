import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    let email = sessionUser?.email;

    if (!email) {
      const adminCookie = getCookie(event, "auth_admin_info");
      if (adminCookie) {
        try {
          const adminData = JSON.parse(adminCookie);
          email = adminData?.email;
        } catch {}
      }
    }

    if (!email) {
      return FormatResponse.error(event, "Bạn chưa đăng nhập!");
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "Không tìm thấy người dùng!");
    }

    const isDefaultAvatar = (avatar?: string | null) =>
      !avatar ||
      avatar === "default-avatar.png" ||
      avatar === "/images/avatars/default-avatar.png";

    // Đồng bộ avatar và tên từ session (ví dụ đăng nhập Google) vào DB nếu DB đang để mặc định
    const updates: Record<string, any> = {};
    if (isDefaultAvatar(user.avatar) && sessionUser?.image && !isDefaultAvatar(sessionUser.image)) {
      updates.avatar = sessionUser.image;
    }
    if (!user.name && sessionUser?.name) {
      updates.name = sessionUser.name;
    }
    if (Object.keys(updates).length > 0) {
      await user.update(updates);
    }

    const resolveAvatar = (avatar?: string | null) => {
      if (isDefaultAvatar(avatar) && sessionUser?.image) {
        return sessionUser.image;
      }
      if (!avatar) return sessionUser?.image || "/others/logo.svg";
      if (
        avatar.startsWith("http://") ||
        avatar.startsWith("https://") ||
        avatar.startsWith("/")
      ) {
        return avatar;
      }
      return `/images/avatars/${avatar}`;
    };

    return FormatResponse.success(
      {
        name: user.name || sessionUser?.name || "",
        avatar: resolveAvatar(user.avatar),
        email: user.email,
        birthday: user.birthday,
        phone: user.phone,
        introduction: user.introduction,
        social: user.social,
      },
      "Lấy thông tin thành công!",
    );
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
