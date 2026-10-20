import { DataPattern } from ".";

export class TagData extends DataPattern {
  protected table = "Tag";
  public async getAll(): Promise<any> {
    try {
      const TagModel = this.getModels()?.Tag;
      const attributes = ["id", "name", "slug", "description", "status"];
      return await this.pagination(TagModel, { attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getTagWithCategory(id: number | string): Promise<any> {
    const TagModel = this.getModels()?.Tag;
    const ProductModel = this.getModels()?.Product;
    const CategoryModel = this.getModels()?.Category;
    const ProductTagModel = this.getModels()?.ProductTag;
    try {
      return await TagModel.findAll({
        attributes: ["id", "name", "slug"],
        include: [
          {
            model: ProductTagModel,
            as: "product_tag_tags",
            required: true,
            attributes: [],
            include: [
              {
                model: ProductModel,
                as: "products",
                required: true,
                attributes: [],
                where: {
                  categoryId: id,
                },
                include: [
                  {
                    model: CategoryModel,
                    as: "category",
                    required: true,
                    attributes: [],
                  },
                ],
              },
            ],
          },
        ],
        group: ["Tag.id"],
        subQuery: false,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
