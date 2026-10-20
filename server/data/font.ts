import { DataPattern } from ".";

export class FontData extends DataPattern {
  protected table = "Font";

  public async createFontType(data: any) {
    try {
      const FontTypeModel = this.getModels()?.FontType;
      return await FontTypeModel.findOrCreate({
        where: { slug: data.slug },
        defaults: data,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async createFont(data: any) {
    try {
      const FontModel = this.getModels()?.Font;
      return await FontModel.findOrCreate({
        where: { slug: data.slug },
        defaults: data,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async getAllFontTypes() {
    try {
      const FontModel = this.getModels()?.Font;
      const FontTypeModel = this.getModels()?.FontType;
      return await FontTypeModel.findAll({
        include: [{ model: FontModel, as: "fonts" }],
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
