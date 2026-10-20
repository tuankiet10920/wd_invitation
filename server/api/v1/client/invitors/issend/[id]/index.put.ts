import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  const { Invitor: InvitorModel } = global.__db;
  const id = getRouterParam(event, "id");
  if (!id) return FormatResponse.error(event, "Data is required!");
  try {
    const invitor = await InvitorModel.findByPk(id);
    if (!invitor) return FormatResponse.error(event, "Invitor is not found!");

    invitor.is_send = !invitor.is_send;
    await invitor.save();
    return FormatResponse.success(invitor);
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
