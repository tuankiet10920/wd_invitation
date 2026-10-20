import { DataPattern } from ".";

export class PackagePermissionData extends DataPattern {
  protected table = "PackagePermission";

  public async list(query: any) {
    const PackagePermissionModel = this.getModels()?.PackagePermission;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['createdAt', 'DESC']]
    };
    return await this.pagination(PackagePermissionModel, options);
  }

  public async create(data: any) {
    const PackagePermissionModel = this.getModels()?.PackagePermission;
    return await PackagePermissionModel.create(data);
  }

  public async getById(id: string | number) {
    const PackagePermissionModel = this.getModels()?.PackagePermission;
    return await PackagePermissionModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const PackagePermissionModel = this.getModels()?.PackagePermission;
    return await PackagePermissionModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const PackagePermissionModel = this.getModels()?.PackagePermission;
    return await PackagePermissionModel.destroy({ where: { id } });
  }
}
