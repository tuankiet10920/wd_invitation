import { DataPattern } from ".";

export class SEOPageData extends DataPattern {
  protected table = "SeoPage";

  public async list(query: any) {
    const SeoPageModel = this.getModels()?.SeoPage;
    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "10",
        search: query.search || "",
      },
      where: {},
      includes: [],
      order: [["createdAt", "DESC"]],
      keySearch: "name"
    };
    return await this.pagination(SeoPageModel, options);
  }

  public async create(data: any) {
    const SeoPageModel = this.getModels()?.SeoPage;
    return await SeoPageModel.create(data);
  }

  public async getById(id: string | number) {
    const SeoPageModel = this.getModels()?.SeoPage;
    return await SeoPageModel.findByPk(id);
  }

  public async update(id: string | number, data: any) {
    const SeoPageModel = this.getModels()?.SeoPage;
    return await SeoPageModel.update(data, { where: { id } });
  }

  public async delete(id: string | number) {
    const SeoPageModel = this.getModels()?.SeoPage;
    return await SeoPageModel.destroy({ where: { id } });
  }

  public async getBySlug(slug: string): Promise<any> {
    const SeoPageModel = this.getModels()?.SeoPage;
    try {
      const data = await SeoPageModel.findOne({
        where: {
          slug,
        }
      });
      return data;
    } catch (error) {
       console.error("Error in getBySlug:", error);
       return null;
    }
  }

  public async sitemap() {
    const SeoPageModel = this.getModels()?.SeoPage;
    const configs = useRuntimeConfig();
    try {
      const pages = await SeoPageModel.findAll({
        attributes: [
          "title",
          "slug",
          "priority",
          "change_freq",
          "updatedAt",
          "image",
        ],
      });

      if (!pages || !Array.isArray(pages) || pages.length == 0) return [];

      return pages.map((p: any) => {
        const img = `${configs.public.url}/images/${p.image}`;
        return {
          loc: p.slug,
          lastmod: p.updatedAt,
          changeFreq: p.change_freq,
          priority: p.priority,
          images: [
            {
              loc: img,
              title: p.title,
            },
          ],
        };
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
