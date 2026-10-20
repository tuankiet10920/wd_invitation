import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const { Image: ImageModel, ImageType: ImageTypeModel } = global.__db;

    const openingImageType = await ImageTypeModel.findOne({
      where: { key: "opening_effect_gif" }
    });

    if (!openingImageType) {
      return FormatResponse.success([], "No opening_effect_gif type found");
    }

    const images = await ImageModel.findAll({
      where: {
        id_image_type: openingImageType.id
      },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'url', 'createdAt']
    });

    return FormatResponse.success(images, "Fetched opening images successfully!");
  } catch (error) {
    console.error("Error fetching opening images:", error);
    return FormatResponse.failure(error);
  }
});
