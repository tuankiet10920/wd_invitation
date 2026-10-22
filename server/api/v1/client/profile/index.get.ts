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

    const normalizeAvatar = (avatar?: string | null) => {
      if (!avatar) return "/images/avatars/default-avatar.png";
      if (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/")) {
        return avatar;
      }
      return `/images/avatars/${avatar}`;
    };

    return FormatResponse.success(
      {
        name: user.name,
        avatar: normalizeAvatar(user.avatar),
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
