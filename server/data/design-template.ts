import { DataPattern } from ".";

export class DesignTemplateData extends DataPattern {
  protected table = "DesignTemplate";

  public async list(query: any) {
    const DesignTemplateModel = this.getModels()?.DesignTemplate;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['createdAt', 'DESC']]
    };
    return await this.pagination(DesignTemplateModel, options);
  }

  public async create(data: any) {
    const DesignTemplateModel = this.getModels()?.DesignTemplate;
    return await DesignTemplateModel.create(data);
  }

  public async getById(id: string | number) {
    const DesignTemplateModel = this.getModels()?.DesignTemplate;
    return await DesignTemplateModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const DesignTemplateModel = this.getModels()?.DesignTemplate;
    return await DesignTemplateModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const DesignTemplateModel = this.getModels()?.DesignTemplate;
    return await DesignTemplateModel.destroy({ where: { id } });
  }
}
