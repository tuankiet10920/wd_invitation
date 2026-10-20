import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import fs from "node:fs/promises";
import path from "node:path";
import { readMultipartFormData } from "h3";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
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

    const parts = await readMultipartFormData(event);
    if (!parts || parts.length === 0) {
      return FormatResponse.error(event, "No file provided");
    }

    let fileData = null;
    let duration = 0;

    for (const part of parts) {
      if (part.name === 'file' && part.filename) {
         fileData = part;
      }
      if (part.name === 'duration') {
         duration = parseFloat(part.data.toString()) || 0;
      }
    }

    if (!fileData) {
      return FormatResponse.error(event, "No music file provided");
    }

    // Check size: 10MB = 10 * 1024 * 1024 = 10485760
    if (fileData.data.length > 10485760) {
       return FormatResponse.error(event, "Kích thước file vượt quá 10MB");
    }

    const { Music: MusicModel, MusicType: MusicTypeModel } = global.__db;

    // Find the personal type
    const personalType = await MusicTypeModel.findOne({
      where: { key: "personal" }
    });

    if (!personalType) {
      return FormatResponse.error(event, "Personal type not configured in database.");
    }

    // Check limits (max 5)
    const currentCount = await MusicModel.count({
        where: { id_user: user.id, id_music_type: personalType.id }
    });

    if (currentCount >= 5) {
       return FormatResponse.error(event, "Đã đạt giới hạn 5 file âm nhạc tải lên.");
    }

    const saveDir = path.join(process.cwd(), config.publicDir, "personal_musics");
    try {
      await fs.access(saveDir);
    } catch {
      await fs.mkdir(saveDir, { recursive: true });
    }

    // Generate unique slug
    const timestamp = Date.now();
    const slug = `personal-${timestamp}`;
    
    // Create music record
    const newMusic = await MusicModel.create({
      url: "", 
      name: fileData.filename,
      slug: slug,
      duration: Math.round(duration),
      id_music_type: personalType.id,
      id_user: user.id,
      id_min_package: null,
    });

    // Save file to personal_musics
    const ext = path.extname(fileData.filename || '.mp3');
    const filename = `PERSONAL_MUSIC_${newMusic.id}_${timestamp}${ext}`;
    const filePath = path.join(saveDir, filename);

    await fs.writeFile(filePath, fileData.data);

    // Update url
    await newMusic.update({ url: filename });

    return FormatResponse.success(
      {
        id: newMusic.id,
        url: filename,
        name: newMusic.name,
        duration: newMusic.duration,
        slug: newMusic.slug,
      },
      "Tải nhạc lên thành công!"
    );
  } catch (error) {
    console.error("Error uploading personal music:", error);
    return FormatResponse.failure(error);
  }
});
