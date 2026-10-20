import { DataPattern } from ".";

export class WeddingCardData extends DataPattern {
  protected table = "WeddingCard";

  public async list(query: any) {
    const WeddingCardModel = this.getModels()?.WeddingCard;

    const where: any = {};
    if (query.id_user) {
        where.id_user = query.id_user;
    }
    if (query.is_template !== undefined) {
        where.is_template = query.is_template === 'true' || query.is_template === true;
    }
    if (query.id_category_wedding_card) {
        where.id_category_wedding_card = query.id_category_wedding_card;
    }
    if (query.is_public !== undefined) {
        where.is_public = query.is_public === 'true' || query.is_public === true;
    }
    if (query.id_package) {
        where.id_package = query.id_package;
    }
    if (query.is_template_user !== undefined) {
        where.is_template_user = query.is_template_user === 'true' || query.is_template_user === true;
    }
    if (query.is_publish !== undefined) {
        where.is_publish = query.is_publish === 'true' || query.is_publish === true;
    }

    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where,
      includes: [
        { model: this.getModels()?.CategoryWeddingCard, as: "category" },
        { model: this.getModels()?.Package, as: "package" },
      ],
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(WeddingCardModel, options);
  }

  public async create(data: any) {
    const WeddingCardModel = this.getModels()?.WeddingCard;
    return await WeddingCardModel.create(data);
  }

  public async getById(id: string | number) {
    const WeddingCardModel = this.getModels()?.WeddingCard;
    const UserModel = this.getModels()?.User;
    const PackageModel = this.getModels()?.Package;
    
    return await WeddingCardModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
          include: [{ model: PackageModel, as: "package" }],
        },
      ],
    });
  }

  public async getByUrl(url: string) {
    const WeddingCardModel = this.getModels()?.WeddingCard;
    const UserModel = this.getModels()?.User;
    const PackageModel = this.getModels()?.Package;

    return await WeddingCardModel.findOne({ 
      where: { url },
      include: [
        {
          model: UserModel,
          as: "user", // Phải match với index.js
          include: [{ model: PackageModel, as: "package" }],
        },
      ], 
    });
  }

  public async update(id: string | number, data: any) {
    const WeddingCardModel = this.getModels()?.WeddingCard;
    console.log("data: ", data);
    return await WeddingCardModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const WeddingCardModel = this.getModels()?.WeddingCard;
    return await WeddingCardModel.destroy({ where: { id } });
  }
}
