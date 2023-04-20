import { scrapeAmazonSearch } from './scrapeAmazonSearch';
import { AmazonSite, Product } from './types';
require('dotenv').config();
const domains:string = process.env.DOMAINS;

const run = async () => {
  while (true) {
    try {
      const domains = process.env.DOMAINS;
      const results = await scrapeAmazonSearch('', domains.split(',') as AmazonSite[]);
      console.log(results);
    } catch (error) {
      console.log(`Error running scrapeAmazonSearch: ${error.message}`);
    }
  }
}

run();
