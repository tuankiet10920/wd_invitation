import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  const { Invitor: InvitorModel } = global.__db;
  const id = getRouterParam(event, "id");
  
  if (!id) return FormatResponse.error(event, "ID is required!");
  
  try {
    const invitor = await InvitorModel.findByPk(id);
    if (!invitor) return FormatResponse.error(event, "Invitor is not found!");

    const body = await readBody(event);
    if (!body || typeof body !== 'object') {
        return FormatResponse.error(event, "Invalid request body");
    }

    const { invitation, value, isCustom } = body;

    // Check if we need to update content
    if (invitation !== undefined || value !== undefined || isCustom !== undefined) {
        let currentContent = {};
        try {
            if (invitor.content) {
                currentContent = JSON.parse(invitor.content);
            }
        } catch(e) {}

        const newContent = {
            ...currentContent,
            ...(invitation !== undefined && { invitation }),
            ...(value !== undefined && { value }),
            ...(isCustom !== undefined && { isCustom })
        };

        invitor.content = JSON.stringify(newContent);
        await invitor.save();
    }

    return FormatResponse.success(invitor, "Invitor updated successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
