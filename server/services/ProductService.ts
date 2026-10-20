import FormatResponse from "~~/composables/FormatResponse";
import { ProductData } from "~~/server/data/product";
import { CategoryData } from "../data/category";
import { BannerData } from "../data/banner";
import { SEOPageData } from "../data/seo-page";
import { BrandData } from "../data/brand";
import { TagData } from "../data/tag";
import { NewsWithTypeData } from "../data/news-with-type";

const Product = new ProductData();
const Category = new CategoryData();
const Banner = new BannerData();
const SEOPage = new SEOPageData();
const Brand = new BrandData();
const Tag = new TagData();
const NewsWithType = new NewsWithTypeData();

export class ProductService {
  public async getBrandProducts(event: any) {
    try {
      const id = getRouterParam(event, "id");

      if (!id) return FormatResponse.error("Brand ID is required!");

      const data = await Product.getProductsWithBrandData(id);

      if (!data)
        return FormatResponse.error(
          "Error while getting data from products with brand ID!"
        );

      return FormatResponse.paginate(data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  public async getAllProductsHomePage(event: any) {
    try {
      const products = await Product.getAllProductsWithAllParentsCategories();
      const featuredCategories = await Category.getFeaturedParentsAndChilds();
      const categories = JSON.parse(JSON.stringify(featuredCategories)); // convert to raw
      if (categories && Array.isArray(categories) && categories.length > 0) {
        for (let index = 0; index < categories.length; index++) {
          const brandsOfProduct = await Brand.getBrandsWithCategoryProduct(
            categories[index].id
          );

          categories[index].brands = JSON.parse(
            JSON.stringify(brandsOfProduct)
          ).map((_brand: any) => {
            return {
              ..._brand.brand,
            };
          });

          const currentTags = await Tag.getTagWithCategory(
            categories[index].id
          );

          categories[index].tags = currentTags;

          const bestSellingProducts =
            await Product.getBestSellingProductWithCategory(
              categories[index].id
            );

          categories[index].best_selling_products = bestSellingProducts;
        }
      }
      const banersSlide = await Banner.getBannersPosition();
      const seo = await SEOPage.getSEOPage();
      const newsWithType = await NewsWithType.getDataTypeNewsAndNewsWithType();
      return FormatResponse.success({
        products,
        categories,
        slide: banersSlide,
        newsData:
          newsWithType && Array.isArray(newsWithType) && newsWithType.length > 0
            ? newsWithType[0]
            : null,
        seo,
      });
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  public async changeAllImages(event: any) {
    try {
      const data = await Product.changeAllPathImages();
      return FormatResponse.success(data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  public async synthProductsWithCategory(event: any) {
    try {
      await Product.updateAllCategoryProduct();
      return FormatResponse.success([]);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
  public async changeFilenameImagesInDB(event: any) {
    try {
      const data = await Product.resolvedImages();
      return FormatResponse.success(data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
