import type { BrandInterface, ProducInterface, TagInterface } from "./";

export interface CategoryInterface {
  id: number;
  name: string;
  slug: string;
}
export interface ParentCategoryInterface extends CategoryInterface {
  isActive: boolean;
  icon: string;
}
export interface CategoryMegaMenuInterface extends ParentCategoryInterface {
  parentId: number | null | string;
  children_categories: CategoryInterface[];
  brands: BrandInterface[];
  tags: TagInterface[];
  best_selling_products: ProducInterface[];
}
