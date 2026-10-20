import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const { Widget: WidgetModel } = global.__db;
    
    // Fetch all widgets ordered by their ID or any predefined order
    const widgets = await WidgetModel.findAll({
        order: [['id', 'ASC']]
    });

    return FormatResponse.success(widgets, "Fetched widgets successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
