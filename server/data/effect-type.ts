import { DataPattern } from ".";

export class EffectTypeData extends DataPattern {
  protected table = "EffectType";

  public async getAll() {
    const Model = this.getModels()?.EffectType;
    return await Model.findAll({
      order: [["id", "ASC"]],
    });
  }
}
