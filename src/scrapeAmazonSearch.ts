import { sendDiscordNotification } from './sendDiscordNotification';
import { AmazonSite, Product, DiscordNotification } from './types';
import { searchSingleAmazonSite } from './searchSingleAmazonSite';
import { loopAmazonCategories } from './loopAmazonCategories';
import { listAmazonCategoryProducts } from './listAmazonCategoryProducts';
require('dotenv').config();
import * as fs from 'fs';
const MAX_DISCOUNT = parseFloat(process.env.MAX_DISCOUNT);
const loggedProductsFilePath = './db/loggedProducts.json';
let loggedProducts: any[] = [];

try {
  const fileData = fs.readFileSync(loggedProductsFilePath, 'utf-8');
  loggedProducts = JSON.parse(fileData);
} catch (error) {
  console.error(error);
}

export const notify = async (products) => {
  for (const product of products) {
    const {title, discountRaw, link, image, originalPrice, price, discount} = product;
    if (discountRaw > MAX_DISCOUNT && !loggedProducts.includes(link)) {
      loggedProducts.push(link);
      fs.writeFileSync(loggedProductsFilePath, JSON.stringify(loggedProducts), 'utf-8');
      const notification: DiscordNotification = {
        username: 'Amazon Scraper Bot',
        avatarUrl: 'https://i.imgur.com/wSTFkRM.png',
        product,
      };
      console.log({notification});

      setTimeout(async() => {
        sendDiscordNotification(notification);
      }, 100);
    }
  }
}

export const scrapeAmazonSearch = async (
  keyword: string,
  domains: AmazonSite[] = ['amazon.com', 'amazon.es', 'amazon.fr']
): Promise<Product[]> => {
  let products: Product[] = [];

  if (keyword === "") {
    for (const domain of domains) {
      // Loop all categories
      const categories: string[] = await loopAmazonCategories(domain);
      for (const category of categories) {
        console.log(`Searching products of ${category}`);
        const results = await listAmazonCategoryProducts(category);
        console.log([`Result products of ${category}`, results.length]);
        notify(results);
        products = [...products, ...results];
        // Wait for random time between 2 to 7 seconds
        const waitTime = Math.floor(Math.random() * 5000) + 2000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  } else {
    // If a keyword is provided, perform the search on all specified domains
    for (const domain of domains) {
      const results = await searchSingleAmazonSite(keyword, domain);
      notify(results);
      products = [...products, ...results];
      // Wait for random time between 2 to 7 seconds
      // const waitTime = Math.floor(Math.random() * 5000) + 2000;
      // await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Remove any duplicate products
  const uniqueProducts = products.reduce((acc, curr) => {
    const duplicated = acc.some((product) => product.link === curr.link);
    if (!duplicated) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return uniqueProducts;
}
