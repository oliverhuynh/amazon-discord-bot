import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import { cache_get, cache_set, exportProduct, openpage } from './common';
const { URL } = require('url');

function getDomainFromUrl(url) {
  const { hostname } = new URL(url);
  return hostname;
}

export const listAmazonCategoryProducts = async (categoryUrl: string): Promise<Product[]> => {
  const key = `list-products-${categoryUrl}`;
  const cachedResult = await cache_get(key);
  if (cachedResult && !cachedResult.length) {
    console.log(`Products is blank in ${categoryUrl}`);
    return cachedResult;
  }
  const domain = getDomainFromUrl(categoryUrl);
  const [page, browser, close] = await openpage(categoryUrl);

  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  const $ = cheerio.load(html);
  await bodyHandle.dispose();

  const products: Product[] = [];

  const href=$('.a-cardui-body > a[href*="/s?"]').attr('href');
  if (href) {
    await close();
    return await listAmazonCategoryProducts(`https://${domain}${href}`);
  }

  $('div.s-result-item').each(async (_, element) => {
    const product = await exportProduct($, element, domain);
    if (product) {
      products.push(product);
    }
  });

  await close();
  await cache_set(key, products);
  return products;
}
