import { UserData } from "../data/user";
import FormatResponse from "~~/composables/FormatResponse";
import bcrypt from "bcrypt";

const User = new UserData();

export class UserService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await User.list(query);
      return FormatResponse.success(result, "Get user list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const user = await User.getById(id);
      if (!user) return FormatResponse.error(event, "User not found!");
      return FormatResponse.success(user, "Get user detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.email || !body.password) {
        return FormatResponse.error(event, "Email and password are required!");
      }

      // Check existence
      const exists = await User.checkUserNormal(body.email);
      if (exists) return FormatResponse.error(event, "Email already exists!");

      // Create
      const newUser = await User.create(body.email, body.password, body.name);
      return FormatResponse.success(newUser, "User created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      const user = await User.getById(id);
      if (!user) return FormatResponse.error(event, "User not found!");

      const updateData: any = {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        birthday: body.birthday || null,
        introduction: body.introduction ?? null,
        is_active: body.is_active !== undefined ? Boolean(body.is_active) : user.is_active,
        role: body.role ? String(body.role).toLowerCase() : user.role,
      };

      if (body.id_package !== undefined && body.id_package !== null && body.id_package !== "") {
        updateData.id_package = Number(body.id_package);
      }

      if (body.avatar !== undefined && body.avatar !== null && body.avatar !== "") {
        updateData.avatar = body.avatar;
      }

      if (body.password && String(body.password).trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(String(body.password).trim(), salt);
      }

      await user.update(updateData);
      return FormatResponse.success(user, "User updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await User.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or user not found!");
      return FormatResponse.success(true, "User deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
