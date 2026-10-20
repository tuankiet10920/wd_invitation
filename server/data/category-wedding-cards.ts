import { DataPattern } from ".";

export class CategoryWeddingCardData extends DataPattern {
  protected table = "CategoryWeddingCard";
  
  public async getAll(): Promise<any> {
    try {
      const Model = this.getModels()?.CategoryWeddingCard;
      if (!Model) {
        throw new Error("CategoryWeddingCard model not found");
      }
      const attributes = ["id", "name"];
      const data = await Model.findAll({
        attributes,
        raw: true
      });
      return data;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
