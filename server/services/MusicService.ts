import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { MusicData } from "../data/music";
import FormatResponse from "~~/composables/FormatResponse";

const Music = new MusicData();

export class MusicService {
  public async getClientMusics(event: any) {
    try {
      const types = await Music.listTypes();
      const musics = await Music.listForClient();

      return FormatResponse.success(
        { types, musics },
        "Get musics successfully!"
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
    try {
      const query = getQuery(event);
      const res = await Music.adminPagination(query);
      return FormatResponse.success(res, "Get music list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getTypes(event: any) {
    try {
      const types = await Music.listTypes();
      return FormatResponse.success(types, "Get types successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getAll(event: any) {
    try {
      const res = await Music.getAll();
      return FormatResponse.success(res, "Get all musics successfully");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    try {
      const body = await readBody(event);
      const res = await Music.create(body);
      return FormatResponse.success(res, "Music created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    try {
      const id = event.context.params.id;
      const body = await readBody(event);
      const res = await Music.update(id, body);
      return FormatResponse.success(res, "Music updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    try {
      const id = event.context.params.id;
      const res = await Music.delete(id);
      return FormatResponse.success(res, "Music deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    try {
      const id = event.context.params.id;
      const res = await Music.getById(id);
      return FormatResponse.success(res, "Get detail successfully");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async cloneMusics(event: any) {
    const body = await readBody(event);
    const { musics } = body;

    if (!musics || !Array.isArray(musics)) {
      return FormatResponse.failure("Musics array is required");
    }

    const results = [];
    const publicDir = path.join(process.cwd(), "public", "musics");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    // Manage Seeder Data
    const seederDataPath = path.join(
      process.cwd(),
      "seeders",
      "data",
      "musics_cloned.json",
    );
    if (!fs.existsSync(path.dirname(seederDataPath)))
      fs.mkdirSync(path.dirname(seederDataPath), { recursive: true });

    let currentSeederData = { musicTypes: [] as any[], musics: [] as any[] };
    if (fs.existsSync(seederDataPath)) {
      try {
        currentSeederData = JSON.parse(fs.readFileSync(seederDataPath, "utf-8"));
      } catch (e) {
        console.error("Error reading seeder data", e);
      }
    }

    for (const music of musics) {
      try {
        // 1. Handle Music Type
        let id_music_type = null;
        let typeSlug: string | null = null;
        if (music.category) {
          typeSlug = music.category.toLowerCase().replace(/\s+/g, '-');
          const typeData = {
            name: music.category.charAt(0).toUpperCase() + music.category.slice(1),
            slug: typeSlug!,
          };
          const resType = await Music.findOrCreateMusicType(typeData as { name: string; slug: string });
          id_music_type = resType.id;

          if (!currentSeederData.musicTypes.some((t) => t.slug === typeSlug)) {
            currentSeederData.musicTypes.push({
              name: typeData.name,
              slug: typeSlug,
              createdAt: resType.createdAt || new Date(),
              updatedAt: resType.updatedAt || new Date(),
            });
          }
        }

        // 2. Download File
        const downloadUrl = `https://assets.cinelove.me/${music.fileKey}`;
        const fileName = path.basename(music.fileKey);
        const filePath = path.join(publicDir, fileName);

        const response = await axios({
          url: downloadUrl,
          method: "GET",
          responseType: "stream",
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        // 3. Save to DB
        const musicData = {
          url: `${fileName}`,
          name: music.title,
          slug: music.id,
          duration: Math.round(music.duration) || 0,
          id_music_type: id_music_type,
          id_user: null,
          id_min_package: 1, // Default to basic
        };
        const resMusic = await Music.create(musicData);

        // Update Seeder file
        if (!currentSeederData.musics.some((m) => m.slug === music.id)) {
          currentSeederData.musics.push({
            ...musicData,
            typeSlug: typeSlug,
            createdAt: resMusic.createdAt || new Date(),
            updatedAt: resMusic.updatedAt || new Date(),
          });
        }

        results.push({ success: true, musicId: music.id, title: music.title });
      } catch (err: any) {
        console.error(`Failed to clone music ${music.id}`, err);
        results.push({
          success: false,
          musicId: music.id,
          title: music.title,
          error: err.message,
        });
      }
    }

    // Save Seeder Data JSON
    fs.writeFileSync(seederDataPath, JSON.stringify(currentSeederData, null, 2));

    return FormatResponse.success(results, "Cloning process completed");
  }
}
