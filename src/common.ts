import axios from 'axios';
import { exec } from 'child_process';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import puppeteer from 'puppeteer-core';
require('dotenv').config();
const fs = require('fs');

const executablePath = process.env.CHROME_EXECUTABLE_PATH;
const userDataDir = process.env.CHROME_DATA_DIR;

const cacheManager = require('cache-manager');
const fsStore = require('cache-manager-fs-binary');
const cacheDir = './cache';
let cache:any =false;
const TTL = 30 * 24 * 60 * 60; // 1 month in seconds

export const cache_set = async(key, value): Promise<any> => {
  await new Promise(resolve => {cache.set(key, value, { ttl: TTL }, resolve)});
}

export const cache_get = async(key): Promise<any> => {
  await cache_init();
  return await new Promise(resolve => {cache.get(key, (err, result) => {resolve(result)})});
}

export const cache_init = async () => {
  if (!cache) {
    await new Promise(resolve => {
      cache = cacheManager.caching({
        store: fsStore,
        options: {
          path: cacheDir,
          ttl: TTL,
          preventfill: false,
          fillcallback: resolve
        }
      });
    });
  }
  return cache;
};

export function removeBrowserPid(pid: number): void {
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

export function runScriptOnSigint(scriptPath: string): void {
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

const exclude = process.env.EXCLUDE;
export const isNotExcluded = ([,linkText]) => {
  return !exclude.split(',').filter(s => {
    return ! s.split(' ').filter(j => {
      return ! linkText.toLowerCase().includes(j.toLowerCase());
    }).length;
  }).length;
}

export const isExcluded = ([,linkText]) => {
  return !isNotExcluded([0, linkText]);
}

export const exportProduct = async ($, element, domain): Promise<any> => {
  const title = $(element).find('h2').text().trim();
  const productLink = $(element).find('a.a-link-normal').attr('href');
  const link = `https://${domain}${productLink}`;
  const image = $(element).find('img').attr('src') ?? $(element).find('img').attr('srcset')?.split(',').pop()?.split(' ')[0] ?? '';
  const priceText = $(element).find('span.a-offscreen').text();
  const originalPriceText = $(element).find('span.a-text-price:not(.a-size-base)').text();
  const shipping = $(element).find('.s-align-children-center').length ? $(element).find('.s-align-children-center').text().trim() : '0';
  const shippingCost = $(element).find('.s-prime').length ? 0 : parseFloat(shipping.replace(',', '.').replace(/[^0-9,.]/g, ''));

  if (priceText) {
    const priceMatch = priceText.match(/(\d[\d,]*)\.?\d{0,2}/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
    const originalPriceMatch = originalPriceText.match(/(\d[\d,]*)\.?\d{0,2}/);
    const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(',', '.')) : price;
    const discount = (originalPrice - price) / originalPrice * 100;

    const categoryTree: string[] = [];
    const navigationItems = $('#departments ul li > .a-list-item');

    navigationItems.each((_, item) => {
      const category = $(item).text().trim();
      categoryTree.push(category);
    });

    const isExclude = categoryTree.map(i => [0,i]).filter(isExcluded).length;

    return !isExclude ? {
      title,
      image,
      link,
      price,
      originalPrice,
      discountRaw: discount,
      shippingCost,
      shipping: shippingCost === 0 ? 'Free' : 'Not free',
      discount: discount.toFixed(2),
      categoryTree,
    } : false;
  }

  return false;
};


