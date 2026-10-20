import { Op } from "sequelize";
import { DataPattern } from ".";

export class MusicData extends DataPattern {
  protected table = "Music";

  public async listTypes() {
    const MusicTypeModel = this.getModels()?.MusicType;
    return await MusicTypeModel.findAll({
      order: [["id", "ASC"]],
    });
  }

  public async findOrCreateMusicType(data: { name: string; slug: string }) {
    const MusicTypeModel = this.getModels()?.MusicType;
    let type = await MusicTypeModel.findOne({ where: { slug: data.slug } });
    if (!type) {
      type = await MusicTypeModel.create({
        ...data,
        key: "general"
      });
    }
    return type;
  }

  public async listForClient() {
    const MusicModel = this.getModels()?.Music;
    return await MusicModel.findAll({
      order: [["id", "ASC"]],
    });
  }

  public async adminPagination(query: any): Promise<any> {
    try {
      const MusicModel = this.getModels()?.Music;
      const MusicTypeModel = this.getModels()?.MusicType;
      const PackageModel = this.getModels()?.Package;
      const defaultQuery = { page: "1", limit: "10", search: "" };
      const mergedQuery = { ...defaultQuery, ...query };
      
      const whereCondition = {};
      
      return await this.pagination(MusicModel, {
        query: mergedQuery,
        keySearch: "name",
        where: whereCondition,
        includes: [
          { model: MusicTypeModel, as: "type" },
          { model: PackageModel, as: "minPackage" }
        ]
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async getClientList() {
    return await this.getModels()?.Music.findAll({
      order: [["id", "ASC"]],
    });
  }

  public async getAll(): Promise<any> {
    try {
      return await this.getModels()?.Music.findAll({
        order: [["id", "ASC"]],
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async create(data: any): Promise<any> {
    try {
      const Model = this.getModels()?.Music;
      return await Model.create(data);
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async update(id: number | string, data: any): Promise<any> {
    try {
      const Model = this.getModels()?.Music;
      const item = await Model.findByPk(id);
      if (!item) throw new Error("Không tìm thấy dữ liệu");
      await item.update(data);
      return item;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async delete(id: number | string): Promise<any> {
    try {
      const Model = this.getModels()?.Music;
      const item = await Model.findByPk(id);
      if (!item) throw new Error("Không tìm thấy dữ liệu");
      await item.destroy();
      return true;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async getById(id: number | string): Promise<any> {
    try {
      const Model = this.getModels()?.Music;
      const item = await Model.findByPk(id);
      if (!item) throw new Error("Không tìm thấy dữ liệu");
      return item;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
