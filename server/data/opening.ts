import { DataPattern } from ".";

export class OpeningData extends DataPattern {
  protected table = "Effect";

  public async getAll(): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      const attributes = ["id", "name", "slug", "icon", "icon_type", "id_min_package", "image_left", "image_right", "video", "is_custom"];
      return await EffectModel.findAll({
        where: { id_type_effect: 2 },
        attributes,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      return await EffectModel.create({ ...data, id_type_effect: 2 });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: string | number, data: any): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      const item = await EffectModel.findOne({ where: { id, id_type_effect: 2 } });
      if (!item) return null;
      return await item.update(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: string | number): Promise<boolean> {
    try {
      const EffectModel = this.getModels()?.Effect;
      const item = await EffectModel.findOne({ where: { id, id_type_effect: 2 } });
      if (!item) return false;
      await item.destroy();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getBySlug(slug: string): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      return await EffectModel.findOne({ where: { slug, id_type_effect: 2 } });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async getById(id: string | number): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      return await EffectModel.findOne({ where: { id, id_type_effect: 2 } });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async examplePagination(query: any): Promise<any> {
    try {
      const EffectModel = this.getModels()?.Effect;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      return await this.pagination(EffectModel, {
        query: mergedQuery,
        keySearch: "name",
        where: { id_type_effect: 2 }
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
