import { Op } from "sequelize";
import { DataPattern } from ".";

export class SettingData extends DataPattern {
  protected table = "Setting";

  public async list(query: any) {
    const SettingModel = this.getModels()?.Setting;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(SettingModel, options);
  }

  public async create(data: any) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.create(data);
  }

  public async getById(id: string | number) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.findByPk(id);
  }

  public async getByKey(key: string) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.findOne({
      where: {
        key,
      },
      attributes: ["id", "key", "value"],
    });
  }

  public async getByKeys(keys: string[]) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.findAll({
      where: {
        key: {
          [Op.in]: keys,
        },
      },
      attributes: ["key", "value"],
    });
  }

  public async update(id: string | number, data: any) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const SettingModel = this.getModels()?.Setting;
    return await SettingModel.destroy({ where: { id } });
  }
}
