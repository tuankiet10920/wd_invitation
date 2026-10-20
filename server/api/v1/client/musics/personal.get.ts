import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    if (!email) {
      return FormatResponse.error(event, "Unauthorized");
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "User not found");
    }

    const { Music: MusicModel, MusicType: MusicTypeModel } = global.__db;

    const personalType = await MusicTypeModel.findOne({
      where: { key: "personal" }
    });

    if (!personalType) {
        return FormatResponse.success([], "No records");
    }

    const musics = await MusicModel.findAll({
      where: { id_user: user.id, id_music_type: personalType.id },
      order: [["id", "DESC"]]
    });

    return FormatResponse.success(musics, "Fetched personal musics successfully!");
  } catch (error) {
    console.error("Error fetching personal musics:", error);
    return FormatResponse.failure(error);
  }
});
