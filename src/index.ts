import { scrapeAmazonSearch } from './scrapeAmazonSearch';
require('dotenv').config();
executablePath = process.env.CHROME_EXECUTABLE_PATH;

async function run() {
  while (true) {
    try {
      const domains = process.env.DOMAINS;
      const results = await scrapeAmazonSearch('', domains.split(','));
      console.log(results);
    } catch (error) {
      console.log(`Error running scrapeAmazonSearch: ${error.message}`);
    }
  }
}

run();
