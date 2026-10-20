import { Op } from "sequelize";
import { DataPattern } from ".";

export class WidgetData extends DataPattern {
  protected table = "Widget";

  public async list(query: any) {
    const WidgetModel = this.getModels()?.Widget;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      order: [["id", "ASC"]],
    };
    return await this.pagination(WidgetModel, options);
  }

  public async create(data: any) {
    const WidgetModel = this.getModels()?.Widget;
    return await WidgetModel.create(data);
  }

  public async getById(id: string | number) {
    const WidgetModel = this.getModels()?.Widget;
    return await WidgetModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const WidgetModel = this.getModels()?.Widget;
    return await WidgetModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const WidgetModel = this.getModels()?.Widget;
    return await WidgetModel.destroy({ where: { id } });
  }
}
