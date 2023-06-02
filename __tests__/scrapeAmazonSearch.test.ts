import { scrapeAmazonSearch } from '../src/scrapeAmazonSearch';
import { listAmazonCategoryProducts } from '../src/listAmazonCategoryProducts';

jest.setTimeout(600000);

describe.only('listAmazonCategoryProducts', () => {
  test.only('should return an array of products with title, link, image, originalPrice, price, and discount properties', async () => {
    const categoryUrl = 'https://www.amazon.fr/b/ref=dp_bc_aui_C_3?ie=UTF8&node=30117748031';
    const products = await listAmazonCategoryProducts(categoryUrl);
    console.log(['Products', products]);
    expect(products.length).toBeGreaterThan(0);

    const product = products[0];
    expect(product.title).toBeDefined();
    expect(product.link).toBeDefined();
    expect(product.image).toBeDefined();
    expect(product.originalPrice).toBeDefined();
    expect(product.price).toBeDefined();
    expect(product.discount).toBeDefined();
  });
  test('should return an array of products with title, link, image, originalPrice, price, and discount properties', async () => {
    // const categoryUrl = "https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics/";
    const categoryUrl = 'https://www.amazon.com/s?i=specialty-aps';
    const products = await listAmazonCategoryProducts(categoryUrl);
    console.log(['Products', products]);
    expect(products.length).toBeGreaterThan(0);

    const product = products[0];
    expect(product.title).toBeDefined();
    expect(product.link).toBeDefined();
    expect(product.image).toBeDefined();
    expect(product.originalPrice).toBeDefined();
    expect(product.price).toBeDefined();
    expect(product.discount).toBeDefined();
  });
});


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
    const results = await scrapeAmazonSearch('', ['amazon.es', 'amazon.fr', 'amazon.com']);
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
