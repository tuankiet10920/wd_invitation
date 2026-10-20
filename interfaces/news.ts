export interface NewsInterface {
  id: number;
  title: string;
  slug: string;
  content?: string;
  image?: string;
  id_type?: string | number;
  createdAt?: string;
}
