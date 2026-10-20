import { DataPattern } from ".";
import json from "~~/server/json/products_by_category.json";
import path from "path";
import { Op } from "sequelize";

export class ProductData extends DataPattern {
  protected table = "Product";
  public async getProductsWithBrandData(id: number | string): Promise<any> {
    const BrandModel = this.getModels()?.Brand;
    const ProductModel = this.getModels()?.Product;
    try {
      const attributes: string[] = [
        "id",
        "name",
        "salePrice",
        "stock",
        "mainImage",
        "images",
      ];
      const includes: any = [
        {
          model: BrandModel,
          as: "brand",
          where: { id },
          attributes: ["id", "name", "slug", "description", "featured"],
        },
      ];
      return await this.pagination(ProductModel, {
        attributes,
        includes,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getAllProductsWithAllParentsCategories(): Promise<any> {
    const ProductModel = this.getModels()?.Product;
    const CategoryModel = this.getModels()?.Category;
    const TagModel = this.getModels()?.Tag;
    try {
      const where = { parentId: null, featured: true };
      const include = [
        {
          model: ProductModel,
          as: "product",
          attributes: [
            "id",
            "name",
            "slug",
            "mainImage",
            "price",
            "salePrice",
            "stock",
            "sold",
            "is_contact",
            "featured",
            "status",
          ],
          where: {
            featured: true,
            status: "active",
          },
          include: [
            {
              model: TagModel,
              as: "tags",
              attributes: ["id", "name", "slug"],
              required: false,
            },
          ],
        },
        {
          model: CategoryModel,
          as: "children_categories",
          required: false,
          where: { featured: true },
          attributes: ["id", "name", "slug", "parentId", "featured"],
        },
      ];

      const data = await CategoryModel.findAll({
        where,
        include,
        attributes: ["id", "name", "slug", "parentId", "featured"],
      });

      return data;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async changeAllPathImages() {
    const ProductModel = this.getModels()?.Product;
    try {
      const products = await ProductModel.findAll();
      for (const prod of products) {
        const images = prod.mainImage;
        const arrImg = images.split("/");
        if (arrImg.length == 4) {
          prod.mainImage = arrImg[2] + "/" + arrImg[3];
          prod.save();
        }
      }
      return products;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async updateAllCategoryProduct() {
    const ProductModel = this.getModels()?.Product;
    const CategoryModel = this.getModels()?.Category;
    try {
      for (const [_slug, products] of Object.entries(json)) {
        const currentCategory = await CategoryModel.findOne({
          where: { slug: _slug },
        });

        if (!currentCategory) continue;

        if (!products || products.length == 0) continue;

        for (const prod of products) {
          const currentProduct = await ProductModel.findOne({
            where: { slug: prod.slug },
          });

          if (!currentProduct) continue;

          currentProduct.categoryId = currentCategory.id;

          currentProduct.save();
        }
      }
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async resolvedImages() {
    const ProductModel = this.getModels()?.Product;
    try {
      const data = await ProductModel.findAll({
        attributes: ["id", "name", "slug", "mainImage", "images", "featured"],
      });

      for (const el of data) {
        let originalPath: string = "";
        let images: string[] = [];

        const mainImage = el.mainImage;

        const imagesDb = JSON.parse(
          JSON.parse(JSON.parse(`"${el.images}"`))
        ) as string[];

        // process mainImage
        if (mainImage && typeof mainImage == "string" && mainImage.length > 0) {
          const ext = path.extname(mainImage);
          originalPath = mainImage.split(ext)[0] + ".webp";
        }

        // process images
        if (imagesDb && Array.isArray(imagesDb) && imagesDb.length > 0) {
          for (let index = 0; index < imagesDb.length; index++) {
            const currentImage = imagesDb[index];
            const ext = path.extname(currentImage);
            images = [...images, `${currentImage.split(ext)[0]}.webp`];
          }
        }

        el.mainImage = originalPath;
        el.images = JSON.stringify(images);
        el.featured = true;
        await el.save();
      }

      return data;
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getBestSellingProductWithCategory(
    id: string | number,
    limit: number = 10
  ): Promise<any> {
    const ProductModel = this.getModels()?.Product;
    const CategoryModel = this.getModels()?.Category;
    const TagModel = this.getModels()?.Tag;
    try {
      return await ProductModel.findAll({
        where: {
          status: "active",
          featured: true,
          categoryId: id,
          stock: {
            [Op.gte]: 1,
          },
        },
        attributes: [
          "id",
          "name",
          "price",
          "mainImage",
          "slug",
          "stock",
          "sold",
          "discount",
          "salePrice",
          "is_contact",
          "categoryId"
        ],
        order: [["sold", "DESC"]],
        limit: limit,
        // include: [
        //   {
        //     model: CategoryModel,
        //     as: "category",
        //     attributes: ["id", "name", "slug"],
        //     where: { id },
        //   },
        //   {
        //     model: TagModel,
        //     as: "tags",
        //     attributes: ["id", "name", "slug", "status"],
        //     where: {
        //       status: "active",
        //     },
        //   },
        // ],
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
