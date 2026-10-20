import { DataPattern } from ".";

export class ImgurTokenData extends DataPattern {
  protected table = "ImgurToken";

  public async list(query: any) {
    const ImgurTokenModel = this.getModels()?.ImgurToken;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['createdAt', 'DESC']]
    };
    return await this.pagination(ImgurTokenModel, options);
  }

  public async create(data: any) {
    const ImgurTokenModel = this.getModels()?.ImgurToken;
    return await ImgurTokenModel.create(data);
  }

  public async getById(id: string | number) {
    const ImgurTokenModel = this.getModels()?.ImgurToken;
    return await ImgurTokenModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const ImgurTokenModel = this.getModels()?.ImgurToken;
    return await ImgurTokenModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const ImgurTokenModel = this.getModels()?.ImgurToken;
    return await ImgurTokenModel.destroy({ where: { id } });
  }
}
