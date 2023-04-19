import { scrapeAmazonSearch } from './scrapeAmazonSearch';

async function run() {
  const results = await scrapeAmazonSearch('', ['amazon.es', 'amazon.fr', 'amazon.com']);
  console.log(results);
}

run();
