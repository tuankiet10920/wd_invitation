import type { TagInterface } from "./tag";

export interface ProducInterface {
  id: number;
  name: string;
  slug: string;
  mainImage?: string;
  price?: number;
  salePrice?: string;
  stock?: number;
  sold?: number;
  is_contact?: boolean;
  featured?: boolean;
  status?: string;
}

export interface ProductTagInterface extends ProducInterface {
  tags: TagInterface[];
}
