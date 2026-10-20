export default defineEventHandler(async (event) => {
  try {
    const db = (global as any).__db;
    const { ImageType, Image } = db;
    if (!ImageType || !Image) throw new Error("DB not found");

    const types = await ImageType.findAll({
      where: { key: 'stock' },
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'type']
        }
      ],
      attributes: ['id', 'name', 'slug']
    });

    return {
      success: true,
      data: types,
      message: "Stock categories and images fetch successfully",
      code: 200
    };
  } catch (error: any) {
    console.error("Stocks fetch error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
      code: 500
    };
  }
});
