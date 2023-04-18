import { scrapeAmazonSearch } from '../src/scrapeAmazonSearch';

jest.setTimeout(600000);

describe('scrapeAmazonSearch', () => {
  it('should scrape Amazon search results for a specific keyword', async () => {
    const results = await scrapeAmazonSearch('laptop', ['amazon.com', 'amazon.fr', 'amazon.es']);
    console.log(['Results', results]);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
    expect(results[0].link).toBeDefined();
    expect(results[0].price).toBeDefined();
  });

  it('should scrape Amazon search results for all products', async () => {
    const results = await scrapeAmazonSearch('', ['amazon.com', 'amazon.fr', 'amazon.es']);
    console.log(['Results', results]);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
    expect(results[0].link).toBeDefined();
    expect(results[0].price).toBeDefined();
  });

  it('should scrape Amazon search results for discounted products', async () => {
    const results = await scrapeAmazonSearch('', ['amazon.com', 'amazon.fr', 'amazon.es']);
    console.log(['Results', results]);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
    expect(results[0].link).toBeDefined();
    expect(results[0].price).toBeDefined();
    expect(results[0].discount).toBeDefined();
  });
});
