import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import { exportProduct, newbrowser } from './searchSingleAmazonSite';
const { URL } = require('url');

function getDomainFromUrl(url) {
  const { hostname } = new URL(url);
  return hostname;
}

export const listAmazonCategoryProducts = async (categoryUrl: string): Promise<Product[]> => {
  const domain = getDomainFromUrl(categoryUrl);
  const browser = await newbrowser();
  const page = await browser.newPage();
  await page.goto(categoryUrl);

  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  const $ = cheerio.load(html);
  await bodyHandle.dispose();

  const products: Product[] = [];

  $('div.s-result-item').each(async (_, element) => {
    const product = await exportProduct($, element, domain);
    if (product) {
      products.push(product);
    }
  });

  await browser.close();
  return products;
}
