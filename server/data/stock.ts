import { DataPattern } from ".";

export class StockData extends DataPattern {
  protected table = "Image";

  public async getAll(): Promise<any> {
    try {
      const ImageModel = this.getModels()?.Image;
      const ImageTypeModel = this.getModels()?.ImageType;
      
      return await ImageModel.findAll({
        include: [{
            model: ImageTypeModel,
            as: 'type',
            where: { key: 'stock' }
        }],
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const ImageModel = this.getModels()?.Image;
      return await ImageModel.create({
        ...data,
        id_user: null, 
        id_min_package: data.id_min_package || 1
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: string | number, data: any): Promise<any> {
    try {
      const ImageModel = this.getModels()?.Image;
      const item = await ImageModel.findByPk(id);
      if (!item) throw new Error("Item not found");
      return await item.update(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: string | number): Promise<boolean> {
    try {
      const ImageModel = this.getModels()?.Image;
      const item = await ImageModel.findByPk(id);
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
      const ImageModel = this.getModels()?.Image;
      const item = await ImageModel.findByPk(id);
      if (!item) throw new Error("Item not found");
      return item;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async pagination(query: any): Promise<any> {
    try {
      const ImageModel = this.getModels()?.Image;
      const ImageTypeModel = this.getModels()?.ImageType;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      return await super.pagination(ImageModel, {
        query: mergedQuery,
        keySearch: "url",
        includes: [
          {
            model: ImageTypeModel,
            as: 'imageType',
            where: { key: 'stock' }
          }
        ]
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
