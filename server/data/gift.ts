import { DataPattern } from ".";

export class GiftData extends DataPattern {
  protected table = "Gift";

  public async list(query: any) {
    const GiftModel = this.getModels()?.Gift;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "50",
        search: query.search || "",
      },
      where: {},
      order: [["price", "ASC"]],
    };
    return await this.pagination(GiftModel, options);
  }

  public async create(data: any) {
    const GiftModel = this.getModels()?.Gift;
    return await GiftModel.create(data);
  }

  public async getById(id: string | number) {
    const GiftModel = this.getModels()?.Gift;
    return await GiftModel.findByPk(id, { raw: true });
  }

  public async update(id: string | number, data: any) {
    const GiftModel = this.getModels()?.Gift;
    return await GiftModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const GiftModel = this.getModels()?.Gift;
    return await GiftModel.destroy({ where: { id } });
  }
}
