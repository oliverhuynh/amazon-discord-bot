export type AmazonSite = 'amazon.com' | 'amazon.es' | 'amazon.fr';

export interface Product {
  title: string;
  link: string;
  image: string;
  price: number;
  discount: number;
}
