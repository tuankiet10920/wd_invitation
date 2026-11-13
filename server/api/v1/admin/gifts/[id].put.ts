import { GiftData } from "~~/server/data/gift";
import FormatResponse from "~~/composables/FormatResponse";

const Gift = new GiftData();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return FormatResponse.error(event, "ID is required!", 400);
    const body = await readBody(event);
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.price !== undefined) updateData.price = Number(body.price) || 0;
    if (body.file !== undefined) updateData.file = body.file;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.background !== undefined) updateData.background = body.background;

    await Gift.update(id, updateData);
    const updated = await Gift.getById(id);
    return FormatResponse.success(updated, "Updated gift successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});

