import { ImgurTokenData } from "../data/imgur-token";
import FormatResponse from "~~/composables/FormatResponse";

const ImgurToken = new ImgurTokenData();

export class ImgurTokenService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await ImgurToken.list(query);
      return FormatResponse.success(result, "Get token list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await ImgurToken.getById(id);
      if (!item) return FormatResponse.error(event, "Token not found!");
      return FormatResponse.success(item, "Get token detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.accessToken) {
           return FormatResponse.error(event, "Access Token is required!");
      }
      
      const newItem = await ImgurToken.create(body);
      return FormatResponse.success(newItem, "Token added successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await ImgurToken.update(id, body);
      const updatedItem = await ImgurToken.getById(id);
      return FormatResponse.success(updatedItem, "Token updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await ImgurToken.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or token not found!");
      return FormatResponse.success(true, "Token deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
