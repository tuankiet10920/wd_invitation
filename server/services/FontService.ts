import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { FontData } from "../data/font";
import FormatResponse from "~~/composables/FormatResponse";

const Font = new FontData();

export class FontService {
  public async cloneFonts(event: any) {
    const body = await readBody(event);
    const { fonts } = body;

    if (!fonts || !Array.isArray(fonts)) {
      return FormatResponse.error(event, "Fonts array is required");
    }

    const results = [];
    const publicDir = path.join(process.cwd(), "public", "images", "fonts");
    const fontImagesDir = path.join(
      process.cwd(),
      "public",
      "images",
      "font-images",
    );

    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(fontImagesDir))
      fs.mkdirSync(fontImagesDir, { recursive: true });

    // Manage Seeder Data
    const seederDataPath = path.join(
      process.cwd(),
      "seeders",
      "data",
      "fonts_cloned.json",
    );
    if (!fs.existsSync(path.dirname(seederDataPath)))
      fs.mkdirSync(path.dirname(seederDataPath), { recursive: true });
    let currentSeederData = { fontTypes: [] as any[], fonts: [] as any[] };
    if (fs.existsSync(seederDataPath)) {
      try {
        currentSeederData = JSON.parse(
          fs.readFileSync(seederDataPath, "utf-8"),
        );
      } catch (e) {
        console.error("Error reading seeder data", e);
      }
    }

    for (const font of fonts) {
      try {
        // ... (Font Type creation logic stays same)
        let id_font_type = null;
        if (font.category) {
          const resType = await Font.createFontType({
            name:
              font.category.charAt(0).toUpperCase() + font.category.slice(1),
            slug: font.category,
          });
          const fontType = resType[0];
          id_font_type = fontType.id;

          // Seeder: Update Type
          if (
            !currentSeederData.fontTypes.some((t) => t.slug === font.category)
          ) {
            currentSeederData.fontTypes.push({
              name: fontType.name,
              slug: fontType.slug,
              createdAt: fontType.createdAt || new Date(),
              updatedAt: fontType.updatedAt || new Date(),
            });
          }
        }

        const downloadUrl = `https://assets.cinelove.me/fonts/webfonts/${font.id}/${font.id}.woff2`;
        const fileName = `${font.id}.woff2`;
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

        // 2.1 Download Image (Thumbnail) -> Font Images Folder
        let thumbFileNameOnly = null;
        if (font.thumbnail) {
          try {
            const thumbUrl = `https://assets.cinelove.me/${font.thumbnail}`;
            thumbFileNameOnly = path.basename(font.thumbnail);
            const thumbSavePath = path.join(fontImagesDir, thumbFileNameOnly);

            const thumbResponse = await axios({
              url: thumbUrl,
              method: "GET",
              responseType: "stream",
            });
            const thumbWriter = fs.createWriteStream(thumbSavePath);
            thumbResponse.data.pipe(thumbWriter);
            await new Promise((resolve, reject) => {
              thumbWriter.on("finish", resolve);
              thumbWriter.on("error", reject);
            });
          } catch (e) {
            console.warn(`Failed to clone thumbnail for ${font.id}`, e);
          }
        }

        // 3. Save to DB
        const resFont = await Font.createFont({
          name: font.name,
          slug: font.id,
          id_font_type: id_font_type,
          path: `/images/fonts/${fileName}`,
          image: thumbFileNameOnly,
        });
        const newFont = resFont[0];

        // Seeder: Update Font
        if (!currentSeederData.fonts.some((f) => f.slug === font.id)) {
          currentSeederData.fonts.push({
            name: newFont.name,
            slug: newFont.slug,
            id_font_type_slug: font.category,
            path: newFont.path,
            image: newFont.image,
            createdAt: newFont.createdAt || new Date(),
            updatedAt: newFont.updatedAt || new Date(),
          });
        }

        results.push({ success: true, fontId: font.id, name: font.name });
      } catch (err) {
        console.error(`Failed to clone font ${font.id}`, err);
        results.push({
          success: false,
          fontId: font.id,
          name: font.name,
          error: (err as any).message,
        });
      }
    }

    // Save final seeder data
    fs.writeFileSync(
      seederDataPath,
      JSON.stringify(currentSeederData, null, 2),
    );

    return FormatResponse.success(results, "Cloning process finished");
  }

  public async getFontTypes(event: any) {
    try {
      const data = await Font.getAllFontTypes();
      return FormatResponse.success(data, "Success");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
