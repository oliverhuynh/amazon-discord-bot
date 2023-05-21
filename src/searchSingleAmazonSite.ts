import axios from 'axios';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import { newbrowser, runScriptOnSigint, exportProduct } from './common';
import puppeteer from 'puppeteer-core';
require('dotenv').config();

const executablePath = process.env.CHROME_EXECUTABLE_PATH;
const userDataDir = process.env.CHROME_DATA_DIR;

runScriptOnSigint('./test.sh --kill');

export const searchSingleAmazonSite = async (
  keyword: string,
  domain: AmazonSite
): Promise<Product[]> => {
  const [browser, close] = await newbrowser();
  const page = await browser.newPage();
  const cookies = await page.cookies(`https://${domain}`);
  await close();
  const cookieHeader = cookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
  const url = `https://${domain}/s?k=${keyword}`;

  const response = await axios.get(url, {
    headers: {
      Cookie: cookieHeader,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    },
  });

  const $ = cheerio.load(response.data.toString());

  const products: Product[] = [];

  $('.s-result-item').each(async (_, element) => {
    const product = await exportProduct($, element, domain);
    if (product) {
      products.push(product);
    }
  });

  return products;
};
