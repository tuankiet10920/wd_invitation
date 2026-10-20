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

        const body = await readBody(event);

        // Only allow updating specific fields
        const allowedFields: Record<string, string> = {
            name: 'name',
            birthday: 'birthday',
            phone: 'phone',
            bio: 'introduction', // frontend uses 'bio', DB uses 'introduction'
            image: 'avatar',    // frontend uses 'image', DB uses 'avatar'
        };

        const updateData: Record<string, any> = {};
        for (const [frontendKey, dbKey] of Object.entries(allowedFields)) {
            if (body[frontendKey] !== undefined) {
                updateData[dbKey] = body[frontendKey];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return FormatResponse.error(event, "Không có dữ liệu cần cập nhật!");
        }

        await user.update(updateData);

        // Update session with new data
        const newSessionData = {
            ...session.user,
            name: user.name,
            image: user.avatar,
            email: user.email,
        };

        await setUserSession(event, {
            user: newSessionData,
        });

        return FormatResponse.success({
            name: user.name,
            avatar: user.avatar,
            birthday: user.birthday,
            phone: user.phone,
            introduction: user.introduction,
        }, "Cập nhật thông tin thành công!");
    } catch (error) {
        return FormatResponse.failure(error);
    }
});
