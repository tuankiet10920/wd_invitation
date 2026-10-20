import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    let userId = null;
    if (email) {
      const user = await User.checkUserNormal(email);
      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
        return FormatResponse.error(event, "Unauthorized");
    }

    const { News: NewsModel, Gallery: GalleryModel } = global.__db;
    
    const feedbacks = await NewsModel.findAll({
        where: { 
            key: "user_feedback",
            id_user: userId
        },
        include: [
            {
                model: GalleryModel,
                as: 'galleries',
                attributes: ['id', 'num']
            }
        ],
        order: [['createdAt', 'DESC']],
    });

    return FormatResponse.success(feedbacks, "Fetched feedback history successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
