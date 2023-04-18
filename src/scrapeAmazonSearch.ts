import { AmazonSite, Product } from './types';
import { searchSingleAmazonSite } from './searchSingleAmazonSite';
import { loopAmazonCategories } from './loopAmazonCategories';
import { listAmazonCategoryProducts } from './listAmazonCategoryProducts';
require('dotenv').config();
const MAX_DISCOUNT = parseFloat(process.env.MAX_DISCOUNT);
let loggedProducts: string[] = [];

export async function scrapeAmazonSearch(
  keyword: string,
  domains: AmazonSite[] = ['amazon.com', 'amazon.es', 'amazon.fr']
): Promise<Product[]> {
  let products: Product[] = [];

  if (keyword === "") {
    for (const domain of domains) {
      // Loop all categories
      const categories: string[] = await loopAmazonCategories(domain);
      for (const category of categories) {
        console.log(`Searching products of ${category}`);
        const results = await listAmazonCategoryProducts(category);
        // console.log([`Result products of ${category}`, results]);
        for (const {title, discountRaw, link, image, originalPrice, price, discount} of results) {
          if (discountRaw > MAX_DISCOUNT && !loggedProducts.includes(link)) {
            loggedProducts.push(link);
            const logText = `Title: ${title}, Link: ${link}, Image: ${image}, Original Price: ${originalPrice}, Price: ${price}, Discount: ${discount}%\n`;
            console.log(logText);
          }
        }
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
