import { DataPattern } from ".";

export class PackageBlockData extends DataPattern {
  protected table = "PackageBlock";

  public async list(query: any) {
    const PackageBlockModel = this.getModels()?.PackageBlock;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['createdAt', 'DESC']]
    };
    return await this.pagination(PackageBlockModel, options);
  }

  public async create(data: any) {
    const PackageBlockModel = this.getModels()?.PackageBlock;
    return await PackageBlockModel.create(data);
  }

  public async getById(id: string | number) {
    const PackageBlockModel = this.getModels()?.PackageBlock;
    return await PackageBlockModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const PackageBlockModel = this.getModels()?.PackageBlock;
    return await PackageBlockModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const PackageBlockModel = this.getModels()?.PackageBlock;
    return await PackageBlockModel.destroy({ where: { id } });
  }
}
