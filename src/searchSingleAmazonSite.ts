import axios from 'axios';
import cheerio from 'cheerio';
import { AmazonSite, Product } from './types';

export const searchSingleAmazonSite = async (
  keyword: string,
  domain: AmazonSite
): Promise<Product[]> => {
  const url = `https://${domain}/s?k=${keyword}`;

  const response = await axios.get(url);
  const $ = cheerio.load(response.data.toString());

  const products: Product[] = [];

  $('.s-result-item').each((_, element) => {
    const title = $(element).find('h2').text().trim();
    const productLink = $(element).find('a.a-link-normal').attr('href');
    const image = $(element).find('img').attr('src') ?? $(element).find('img').attr('srcset')?.split(',').pop()?.split(' ')[0] ?? '';
    const priceStr = $(element).find('.a-price-whole').first().text().replace(',', '');
    const price = priceStr ? parseFloat(priceStr) : 0;
    const discount = $(element).find('.a-price-whole').last().text().replace(',', '');
    const formattedPrice = parseFloat(priceStr) + parseFloat(`0.${discount}`);
    const link = `https://${domain}${productLink}`;
    products.push({ title, link, price, image, discount: formattedPrice });
  });

  return products;
};
