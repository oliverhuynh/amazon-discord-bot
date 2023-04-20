import { scrapeAmazonSearch } from './scrapeAmazonSearch';

async function run() {
  while (true) {
    try {
      const results = await scrapeAmazonSearch('', ['amazon.es', 'amazon.fr', 'amazon.com']);
      console.log(results);
    } catch (error) {
      console.log(`Error running scrapeAmazonSearch: ${error.message}`);
    }
  }
}

run();
