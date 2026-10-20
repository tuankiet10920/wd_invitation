import { DataPattern } from ".";

export class CategoryData extends DataPattern {
  protected table = "Category";
  public async getAll(): Promise<any> {
    try {
      const CategoryModel = this.getModels()?.Category;
      const attributes = ["id", "name", "slug", "description", "featured"];
      return await this.pagination(CategoryModel, { attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getFeaturedParents(): Promise<any> {
    try {
      const CategoryModel = this.getModels()?.Category;
      const data = await CategoryModel.findAll({
        where: {
          featured: true,
          parentId: null,
        },
        attributes: ["id", "name", "slug", "icon"],
        raw: true,
      });
      return data;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getFeaturedParentsAndChilds(): Promise<any> {
    try {
      const CategoryModel = this.getModels()?.Category;
      const data = await CategoryModel.findAll({
        where: {
          featured: true,
          parentId: null,
        },
        attributes: ["id", "name", "slug", "icon", "parentId"],
        include: [
          {
            model: CategoryModel,
            as: "children_categories",
            attributes: ["id", "name", "slug"],
            required: false,
          },
        ],
      });
      return data;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
