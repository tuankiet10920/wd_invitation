import { BankData } from "../data/bank";
import FormatResponse from "~~/composables/FormatResponse";

const Bank = new BankData();

export class BankService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Bank.list(query);
      return FormatResponse.success(result, "Get bank list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Bank.getById(id);
      if (!item) return FormatResponse.error(event, "Bank not found!");
      return FormatResponse.success(item, "Get bank detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.bankName || !body.accountNumber) {
           return FormatResponse.error(event, "Bank Name and Account Number are required!");
      }
      
      const newItem = await Bank.create(body);
      return FormatResponse.success(newItem, "Bank added successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await Bank.update(id, body);
      const updatedItem = await Bank.getById(id);
      return FormatResponse.success(updatedItem, "Bank updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Bank.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or bank not found!");
      return FormatResponse.success(true, "Bank deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
