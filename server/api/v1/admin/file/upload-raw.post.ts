import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event);
  if (!multipart) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  const filePart = multipart.find((part) => part.name === "file");
  const folderPart = multipart.find((part) => part.name === "folder");

  if (!filePart || !filePart.filename || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: "Missing file" });
  }

  const folder = folderPart ? folderPart.data.toString() : "misc";
  const ext = path.extname(filePart.filename) || '';
  const saveFilename = `${uuidv4()}${ext}`;

  const configs = useRuntimeConfig();
  const saveDir = path.join(process.cwd(), configs.publicDir, "images", folder);

  try {
    await fs.access(saveDir);
  } catch {
    await fs.mkdir(saveDir, { recursive: true });
  }

  const savePath = path.join(saveDir, saveFilename);

  try {
    await fs.writeFile(savePath, filePart.data);
    return {
      success: true,
      path: saveFilename, // only return filename directly or a path for the front-end?
      url: `/images/${folder}/${saveFilename}`,
      message: "File uploaded successfully"
    };
  } catch (error) {
    console.error("Error saving raw file:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to save file" });
  }
});
