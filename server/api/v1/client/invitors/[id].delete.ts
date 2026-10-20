import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  const { Invitor: InvitorModel } = global.__db;
  const id = getRouterParam(event, "id");
  
  if (!id) return FormatResponse.error(event, "ID is required!");
  
  try {
    const invitor = await InvitorModel.findByPk(id);
    if (!invitor) return FormatResponse.error(event, "Invitor is not found!");

    await invitor.destroy();
    return FormatResponse.success(true, "Invitor deleted successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
