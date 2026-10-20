import FormatResponse from "~~/composables/FormatResponse";
import { StockTypeData } from "../data/stock-type";

const StockType = new StockTypeData();

export class StockTypeService {
  public async getAll(event: any) {
    try {
      const data = await StockType.getAll();
      return FormatResponse.success(data, "Get stock types successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await StockType.pagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name)
        return FormatResponse.error(event, "Name is required!");

      // Prevent key mutation
      body.key = 'stock';
      const newItem = await StockType.create(body);
      return FormatResponse.success(newItem, "Stock type created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      // Prevent key mutation
      body.key = 'stock';
      const updatedItem = await StockType.update(id, body);
      if (!updatedItem) return FormatResponse.error(event, "Stock type not found!");
      
      return FormatResponse.success(updatedItem, "Stock type updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await StockType.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or stock type not found!");
      return FormatResponse.success(true, "Stock type deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await StockType.getById(id);
      if (!item) return FormatResponse.error(event, "Stock type not found!");
      return FormatResponse.success(item, "Get stock type detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
