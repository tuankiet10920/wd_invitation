import { Op } from "sequelize";
import { DataPattern } from ".";
import type { Social } from "~~/interfaces";

interface Attributes {
  email?: string;
  facebookUserId?: string;
}

export class UserData extends DataPattern {
  protected table = "User";
  public async checkUserNormal(email: string): Promise<any> {
    const UserModel = this.getModels()?.User;
    try {
      // Kiểm tra user tồn tại
      const user = await UserModel.findOne({
        where: { email },
      });

      console.log(
        user
          ? `Find User: <email:${email}>`
          : `User not found with <email:${email}>`,
      );

      return user;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async create(email: string, password: string, name: string) {
    const UserModel = this.getModels()?.User;
    const social: Social = "normal";
    try {
      const user = await UserModel.create({
        name: name ?? "Unnamed",
        email,
        password, // Password sẽ được hash trong model hook
        role: "user",
        is_active: false,
        social,
        avatar: "/images/avatars/default-avatar.png",
      });
      return user;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  async createWithSocial(
    image: string,
    name: string,
    social: Social,
    attributes: Attributes,
  ) {
    const UserModel = this.getModels()?.User;
    let user;
    try {
      switch (social) {
        case "facebook":
          user = await UserModel.create({
            name: name || "Unnamed",
            password: null,
            address: null,
            phone: null,
            role: "user",
            avatar: image,
            social,
            is_active: true,
            facebook_user_id: attributes.facebookUserId,
          });
          break;
        case "google":
          user = await UserModel.create({
            name,
            email: attributes.email,
            password: null,
            phone: null,
            role: "user",
            avatar: image,
            social,
            is_active: true,
            is_google: true,
          });
          break;

        default:
          break;
      }

      return user;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  async checkUserFacebook(userFacebookId: string) {
    const UserModel = this.getModels()?.User;
    try {
      const user = await UserModel.findOne({
        where: {
          facebook_user_id: userFacebookId,
        },
      });

      console.log(
        user
          ? `Find User: <facebook_user_id:${userFacebookId}>`
          : `User not found with <facebook_user_id:${userFacebookId}>`,
      );

      return user;
    } catch (error) {
      return this.failure(error as Error);
    }
  }

  public async list(query: any) {
    const models = this.getModels();
    const UserModel = models?.User;
    const PackageModel = models?.Package;
    const where: any = {};
    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
        { phone: { [Op.like]: `%${query.search}%` } },
      ];
    }
    const options: any = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: "",
      },
      where,
      include: PackageModel ? [{ model: PackageModel, as: "package" }] : [],
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(UserModel, options);
  }

  public async getById(id: string | number) {
    const models = this.getModels();
    const UserModel = models?.User;
    const PackageModel = models?.Package;
    return await UserModel.findByPk(id, {
      include: PackageModel ? [{ model: PackageModel, as: "package" }] : [],
    });
  }

  public async delete(id: string | number) {
    const UserModel = this.getModels()?.User;
    return await UserModel.destroy({ where: { id } });
  }
}
