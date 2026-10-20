import { DataPattern } from ".";

export class BankData extends DataPattern {
  protected table = "Bank";

  public async list(query: any) {
    const BankModel = this.getModels()?.Bank;
    const options = {
        query: {
            page: query.page || "1",
            limit: query.limit || "10",
            search: query.search || "",
        },
        where: {},
        order: [['createdAt', 'DESC']]
    };
    return await this.pagination(BankModel, options);
  }

  public async create(data: any) {
    const BankModel = this.getModels()?.Bank;
    return await BankModel.create(data);
  }

  public async getById(id: string | number) {
    const BankModel = this.getModels()?.Bank;
    return await BankModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const BankModel = this.getModels()?.Bank;
    return await BankModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const BankModel = this.getModels()?.Bank;
    return await BankModel.destroy({ where: { id } });
  }
}
