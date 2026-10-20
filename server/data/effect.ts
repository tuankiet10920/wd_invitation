import { DataPattern } from ".";

export class EffectData extends DataPattern {
  protected table = "Effect";

  public async getAll() {
    const Model = this.getModels()?.Effect;
    return await Model.findAll({
      order: [["id", "ASC"]],
    });
  }
}
