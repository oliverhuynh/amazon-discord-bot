import { AmazonSite, Product } from './types';
import { searchSingleAmazonSite } from './searchSingleAmazonSite';

export async function scrapeAmazonSearch(
  keyword: string,
  domains: AmazonSite[] = ['amazon.com', 'amazon.es', 'amazon.fr']
): Promise<Product[]> {
  let products: Product[] = [];

  if (keyword === "") {
    // If the keyword is blank, perform a search for each character in the alphabet
    for (let i = 97; i <= 122; i++) {
      const char = String.fromCharCode(i);
      for (const domain of domains) {
        const results = await searchSingleAmazonSite(char, domain);
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
      const waitTime = Math.floor(Math.random() * 5000) + 2000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
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
