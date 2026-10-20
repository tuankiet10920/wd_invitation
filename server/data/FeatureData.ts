import { DataPattern } from ".";

export class FeatureData extends DataPattern {
  protected table = "Feature";

  public async list(query: any) {
    const FeatureModel = this.getModels()?.Feature;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['order', 'ASC'], ['createdAt', 'DESC']]
    };
    return await this.pagination(FeatureModel, options);
  }

  public async create(data: any) {
    const FeatureModel = this.getModels()?.Feature;
    return await FeatureModel.create(data);
  }

  public async getById(id: string | number) {
    const FeatureModel = this.getModels()?.Feature;
    return await FeatureModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const FeatureModel = this.getModels()?.Feature;
    return await FeatureModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const FeatureModel = this.getModels()?.Feature;
    return await FeatureModel.destroy({ where: { id } });
  }
}
