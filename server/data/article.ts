import { DataPattern } from ".";

export class ArticleData extends DataPattern {
  protected table = "Article";

  public async list(query: any) {
    const ArticleModel = this.getModels()?.Article; // Ensure Article model exists
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      includes: [{ model: this.getModels()?.ArticleType, as: "type" }],
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(ArticleModel, options);
  }

  public async create(data: any) {
    const ArticleModel = this.getModels()?.Article;
    return await ArticleModel.create(data);
  }

  public async getById(id: string | number) {
    const ArticleModel = this.getModels()?.Article;
    return await ArticleModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const ArticleModel = this.getModels()?.Article;
    return await ArticleModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const ArticleModel = this.getModels()?.Article;
    return await ArticleModel.destroy({ where: { id } });
  }
}
