import sharp from "sharp";
import fs from "node:fs/promises";
import axios from "axios";

export class ImageService {
  private actList = ["jpg", "jpeg", "webp", "png"];

  /**
   * @param base64 string image url base64
   * @param path path where save image, which doesnt include filename
   */
  async upload(base64: string, path: string) {
    if (!base64.includes(`;base64,`)) throw new Error("Base64 is not valid!");

    const arrStr = base64.split(`;base64,`);

    if (arrStr.length < 2) throw new Error("Base64 is not enough!");

    if (!this.actList.includes(arrStr[0].split("/")[1]))
      throw new Error("Image is not accepted!");

    const content = base64.split(",")[1] || base64;

    try {
      const buffer = Buffer.from(content, "base64");
      const filename = this.generateFilename();
      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(path + filename);
      console.log(`Uploading ${filename} to ${path} successfully!`);
      return filename;
    } catch (error) {
      throw new Error("Error while uploading image: " + error);
    }
  }

  async delete(path: string) {
    try {
      await fs.unlink(path);
      console.log(`Delete image from path: ${path} - successfully!`);
      return true;
    } catch (error) {
      throw new Error("Error while deleting image: " + error);
    }
  }

  generateFilename(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const random = Math.floor(Math.random() * 1000);
    return `image_${year}_${month}_${day}_${random}_${hour}_${minute}_${second}.webp`;
  }

  async uploadThirdParty(image: string) {
    try {
      const res = await axios.post(
        `https://upload.anhcoder.vn/callback/upload`,
        { image }
      );
      console.log(`Uploading image ${res.data?.path} successfully!`);
      const arr = res.data?.path?.split("/");
      return arr[arr.length - 1];
    } catch (error) {
      throw new Error("Error while uploading image: " + error);
    }
  }
}
