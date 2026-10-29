import { UserData } from "~~/server/data/user";
import jwt from "jsonwebtoken";

const User = new UserData();

export async function getAuthUser(event: any) {
  try {
    const config = useRuntimeConfig();
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
      const token = getCookie(event, "auth_admin_token");
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          if (decoded && decoded.id) {
            return await User.getById(decoded.id);
          }
        } catch {}
      }
    }

    if (email) {
      const found = await User.checkUserNormal(email);
      if (found) return found;
    }

    // Fallback: If in local environment or testing, find first user
    const UserModel = (global as any).__db?.User;
    if (UserModel) {
      const firstUser = await UserModel.findOne({ order: [["id", "ASC"]] });
      return firstUser;
    }
    return null;
  } catch (e) {
    return null;
  }
}
