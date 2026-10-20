import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    if (!email) {
      return FormatResponse.error(event, "Bạn chưa đăng nhập!");
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "Không tìm thấy người dùng!");
    }

    return FormatResponse.success(
      {
        name: user.name,
        avatar: user.avatar,
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
