import { DataPattern } from ".";

export class ArticleTypeData extends DataPattern {
  protected table = "ArticleType";
  public async getAll(): Promise<any> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      const attributes = ["id", "name_vi"];
      return await ArticleTypeModel.findAll({
        attributes,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      return await ArticleTypeModel.create(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: string | number, data: any): Promise<any> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      const item = await ArticleTypeModel.findByPk(id);
      if (!item) return null;
      return await item.update(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: string | number): Promise<boolean> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      const item = await ArticleTypeModel.findByPk(id);
      if (!item) return false;
      await item.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getById(id: string | number): Promise<any> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      return await ArticleTypeModel.findByPk(id);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async examplePagination(query: any): Promise<any> {
    try {
      const ArticleTypeModel = this.getModels()?.ArticleType;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      return await this.pagination(ArticleTypeModel, {
        query: mergedQuery,
        keySearch: "name_vi",
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
