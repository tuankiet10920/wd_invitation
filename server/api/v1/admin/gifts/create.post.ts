import { GiftData } from "~~/server/data/gift";
import FormatResponse from "~~/composables/FormatResponse";

const Gift = new GiftData();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body?.name) {
      return FormatResponse.error(event, "Tên quà tặng là bắt buộc!", 400);
    }
    const created = await Gift.create({
      name: String(body.name).trim(),
      price: Number(body.price) || 0,
      file: body.file || "",
      image: body.image || "",
      background: body.background || body.image || "",
    });
    return FormatResponse.success(created, "Created gift successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});

