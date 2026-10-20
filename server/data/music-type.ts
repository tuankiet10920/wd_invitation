import { DataPattern } from ".";

export class MusicTypeData extends DataPattern {
  protected table = "MusicType";

  public async getAll(): Promise<any> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      const attributes = ["id", "name", "slug", "key"];
      return await MusicTypeModel.findAll({
        attributes,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      return await MusicTypeModel.create(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: string | number, data: any): Promise<any> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      const item = await MusicTypeModel.findByPk(id);
      if (!item) throw new Error("Item not found");
      return await item.update(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: string | number): Promise<boolean> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      const item = await MusicTypeModel.findByPk(id);
      if (!item) throw new Error("Item not found");
      await item.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getById(id: string | number): Promise<any> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      const item = await MusicTypeModel.findByPk(id);
      if (!item) throw new Error("Item not found");
      return item;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async examplePagination(query: any): Promise<any> {
    try {
      const MusicTypeModel = this.getModels()?.MusicType;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      return await this.pagination(MusicTypeModel, {
        query: mergedQuery,
        keySearch: "name",
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
