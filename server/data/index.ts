import { Op } from "sequelize";

interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  [key: string]: any; // accept all other query
}

interface PaginationOption {
  query?: PaginationQuery;
  where?: any;
  includes?: any[];
  order?: any[];
  attributes?: string[];
  keySearch?: string;
  extendData?: any[];
}

export abstract class DataPattern {
  protected table!: string;
  // eslint-disable-next-line
  constructor() {}
  protected getModels() {
    const db = (global as any).__db;
    if (!db) throw new Error("Can't access models db!");
    return db;
  }
  protected failure(error: Error) {
    throw new Error(` in table ${this.table} data file: ${error?.message}`);
  }
  protected async pagination(model: any, options: PaginationOption = {}) {
    const {
      query = { page: "1", limit: "16", search: "" },
      where = {},
      includes = [],
      order = [],
      attributes = [],
      keySearch = "name",
      extendData = [],
    } = options;

    const pageNumber = parseInt(query.page!);
    const perPage = parseInt(query.limit!);
    const searchKeyword = query.search;

    const whereClause: any = { ...where };
    if (searchKeyword) {
      whereClause[keySearch] = { [Op.like]: `%${searchKeyword}%` };
    }

    const totalRecords = await model.count({
      where: whereClause,
      include: includes,
      distinct: true,
    });

    const totalPages = Math.ceil(totalRecords / perPage);
    const offset = (pageNumber - 1) * perPage;

    const paginateRecords = await model.findAll({
      where: whereClause,
      attributes: attributes.length > 0 ? attributes : undefined,
      order: order.length > 0 ? order : undefined,
      limit: perPage,
      offset: offset,
      include: includes.length > 0 ? includes : undefined,
    });

    return {
      count: paginateRecords.length,
      totalCount: totalRecords,
      currentPage: pageNumber,
      totalPages,
      data: paginateRecords,
      extendData,
    };
  }
}
