import { col } from "sequelize";
import { DataPattern } from ".";

export class PackageFeatureData extends DataPattern {
  protected table = "PackageFeature";

  public async list(query: any) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(PackageFeatureModel, options);
  }

  public async getListInternal(id: number | string) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    const FeatureModel = this.getModels()?.Feature;
    return await PackageFeatureModel.findAll({
      where: {
        id_package: id,
      },
      attributes: [
        "id",
        "id_feature",
        [col("features.name"), "name"],
        "status",
      ],
      include: [
        {
          model: FeatureModel,
          as: "features",
          attributes: [], // để trống nếu muốn đẹp
        },
      ],
      raw: true,
      nest: true,
    });
  }

  public async create(data: any) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    return await PackageFeatureModel.create(data);
  }

  public async getById(id: string | number) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    return await PackageFeatureModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    return await PackageFeatureModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const PackageFeatureModel = this.getModels()?.PackageFeature;
    return await PackageFeatureModel.destroy({ where: { id } });
  }
}
