import axios from 'axios';
import { exec } from 'child_process';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import puppeteer from 'puppeteer-core';
require('dotenv').config();
const fs = require('fs');

const executablePath = process.env.CHROME_EXECUTABLE_PATH;
const userDataDir = process.env.CHROME_DATA_DIR;

function removeBrowserPid(pid: number): void {
  const filePath = './tmp/browser_pid.txt';

  // Read the contents of the file
  const data = fs.readFileSync(filePath, 'utf-8');

  // Split the contents by line
  const lines = data.split('\n');

  // Remove the specified PID from the array
  const filteredLines = lines.filter(line => {
    const currentPid = parseInt(line.trim(), 10);
    return currentPid !== pid;
  });

  // Join the remaining lines and write them back to the file
  const newData = filteredLines.join('\n');
  fs.writeFileSync(filePath, newData);
}

export const newbrowser = async(args:any = {}): Promise<any> => {
  const browser = await puppeteer.launch({
    userDataDir,
    executablePath,
    defaultViewport: null, ...args});
  const pid = browser.process().pid;

  fs.appendFileSync('./tmp/browser_pid.txt', pid + '\n');
  const close = async() => {
    removeBrowserPid(pid);
    await browser.close();
  }
  return [browser, close];
}

function runScriptOnSigint(scriptPath: string): void {
  const processId = process.pid;
  process.on('SIGINT', () => {
    console.log(`Caught interrupt signal, running script ${scriptPath}...`);
    exec(`bash ${scriptPath} ${processId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Script execution failed: ${error}`);
        return;
      }
      console.log(`Script executed successfully: ${stdout}`);
    });
    process.exit(0);
  });
}

runScriptOnSigint('./test.sh --kill');

export const openpage = async(url, args = {}): Promise<any> => {
  // Try open but catch 'For information about migrating to our APIs refer to our Marketplace APIs'
  const catched = 'For information about migrating to our APIs refer to our Marketplace APIs';
  let browser;
  let close;
  [browser, close] = await newbrowser({headless: true, ...args});
  // [browser, close] = await newbrowser({headless: false});
  const page = await browser.newPage();
  await page.goto(url);
  let content = await page.content();
  if (content.indexOf(catched) !== -1) {
    await close();
    [ browser, close ] = await newbrowser({headless: false});
    await page.goto(url);
  }
  return [page, browser, close];
}

export const exportProduct = async($, element, domain): Promise<any> => {
  const title = $(element).find('h2').text().trim();
  const productLink = $(element).find('a.a-link-normal').attr('href');
  const link = `https://${domain}${productLink}`;
  const image = $(element).find('img').attr('src') ?? $(element).find('img').attr('srcset')?.split(',').pop()?.split(' ')[0] ?? '';
  const priceText = $(element).find('span.a-offscreen').text();
  const originalPriceText = $(element).find('span.a-text-price:not(.a-size-base)').text();
  const shipping = $(element).find('.s-align-children-center').length ? $(element).find('.s-align-children-center').text().trim() : '0';
  const shippingCost = $(element).find('.s-prime').length ? 0 : parseFloat(shipping.replace(',', '.').replace(/[^0-9,.]/g, ''));
  // console.log({shippingCost, p1: $(element).find('.s-prime').length, p2: $(element).find('.s-align-children-center').length, shipping});
  if (priceText) {
    const priceMatch = priceText.match(/(\d[\d,]*)\.?\d{0,2}/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
    const originalPriceMatch = originalPriceText.match(/(\d[\d,]*)\.?\d{0,2}/);
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(',', '.')) : price;
    const discount = (originalPrice - price) / originalPrice * 100;
    
   return {
      title,
      image,
      link,
      price,
      originalPrice,
      discountRaw: discount,
      shippingCost,
      shipping: shippingCost === 0 ? 'Free' : 'Not free',
      discount: discount.toFixed(2),
    };
  }
  return false;
};

export const searchSingleAmazonSite = async (
  keyword: string,
  domain: AmazonSite
): Promise<Product[]> => {
  const [ browser, close ] = await newbrowser();
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

    /*
    const priceStr = $(element).find('.a-price-whole').first().text().replace(',', '');
    const price = priceStr ? parseFloat(priceStr) : 0;
    const discount = $(element).find('.a-price-whole').last().text().replace(',', '');
    const formattedPrice = parseFloat(priceStr) + parseFloat(`0.${discount}`);
    products.push({ title, link, price, image, discount: formattedPrice });
   */
  });

  return products;
};
