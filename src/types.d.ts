export type AmazonSite = 'amazon.com' | 'amazon.es' | 'amazon.fr';

export interface Product {
  title: string;
  link: string;
  image: string;
  price: number;
  originalPrice: number;
  shippingCost: number;
  discountRaw: number;
  discount: string;
}

export interface DiscordNotification {
  username: string;
  avatarUrl: string;
  product: Product;
}
