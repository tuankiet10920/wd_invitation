import { DataPattern } from ".";

export class PackageData extends DataPattern {
  protected table = "Package";

  public async list(query: any) {
    const PackageModel = this.getModels()?.Package;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(PackageModel, options);
  }

  public async create(data: any) {
    const PackageModel = this.getModels()?.Package;
    return await PackageModel.create(data);
  }

  public async getById(id: string | number) {
    const PackageModel = this.getModels()?.Package;
    return await PackageModel.findByPk(id, { raw: true });
  }

  public async update(id: string | number, data: any) {
    const PackageModel = this.getModels()?.Package;
    return await PackageModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const PackageModel = this.getModels()?.Package;
    return await PackageModel.destroy({ where: { id } });
  }
}
