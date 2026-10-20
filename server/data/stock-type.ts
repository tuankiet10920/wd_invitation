import { DataPattern } from ".";

export class StockTypeData extends DataPattern {
  protected table = "ImageType";

  public async getAll(): Promise<any> {
    try {
      const ImageTypeModel = this.getModels()?.ImageType;
      const attributes = ["id", "name", "slug", "key"];
      return await ImageTypeModel.findAll({
        where: { key: 'stock' },
        attributes,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const ImageTypeModel = this.getModels()?.ImageType;
      data.key = 'stock';
      return await ImageTypeModel.create(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: string | number, data: any): Promise<any> {
    try {
      const ImageTypeModel = this.getModels()?.ImageType;
      const item = await ImageTypeModel.findOne({ where: { id, key: 'stock' } });
      if (!item) throw new Error("Item not found");
      data.key = 'stock'; // Ensure it's not changed
      return await item.update(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: string | number): Promise<boolean> {
    try {
      const ImageTypeModel = this.getModels()?.ImageType;
      const item = await ImageTypeModel.findOne({ where: { id, key: 'stock' } });
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
      const ImageTypeModel = this.getModels()?.ImageType;
      const item = await ImageTypeModel.findOne({ where: { id, key: 'stock' } });
      if (!item) throw new Error("Item not found");
      return item;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async pagination(query: any): Promise<any> {
    try {
      const ImageTypeModel = this.getModels()?.ImageType;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      return await super.pagination(ImageTypeModel, {
        query: mergedQuery,
        keySearch: "name",
        where: { key: 'stock' }
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
