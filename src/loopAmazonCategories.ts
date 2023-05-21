import axios from 'axios';
import * as cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import { cache_get, cache_set, exportProduct, openpage, isNotExcluded } from './common';
import puppeteer from 'puppeteer';
require('dotenv').config();
import * as fs from 'fs';

export const scrapeCategories = async (url: string, page: any, domain: AmazonSite): Promise<string []> => {
  // Check if cache exists for the given URL
  const key = `scrape-cats-${url}`;
  const cachedResult = await cache_get(key);
  if (cachedResult) {
    console.log(`Using cached categories for ${url}`);
    return cachedResult;
  }

  console.log(`Surfing categories for ${url}`);
  await page.goto(url);
  await page.waitForSelector('.apb-browse-left-nav', {timeout: 5000}).catch(()=>{});
  let categoryLinks = await page.$$eval(
    '.apb-browse-left-nav a',
    (links: Element[]) => links.map(link => link.getAttribute('href')).filter(href => href?.startsWith('/s?'))
  );

  categoryLinks = categoryLinks.map(href => `https://${domain}${href}`);
  // Cache the result for the given URL
  await cache_set(key, categoryLinks);

  return categoryLinks;
}

export const loopAmazonCategories = async(domain: AmazonSite): Promise<string []> => {
  const nocache_cats:string = process.env.NOCACHE_CATS || "";
  // Check if cache exists for the given URL
  const url = `https://${domain}`;
  const key = `loop-cats-${url}`;
  const cachedResult = await cache_get(key);
  let cats;
  if ((nocache_cats !== "") || !cachedResult) {
    const [page, browser, close] = await openpage(url, {headless: false});

    // Wait for the "Departments" menu to appear
    await page.waitForSelector('#nav-hamburger-menu');
    await page.waitForTimeout(2000); // wait for 2 seconds for the menu to appear

    // Click on the "Departments" menu to open it
    await page.click('#nav-hamburger-menu');
    await page.waitForTimeout(4000); // wait for 4 seconds for the menu to appear

    // Wait for the subcategories to appear
    await page.waitForSelector('#hmenu-content > ul > li > a');
    if (domain.indexOf('amazon.com') === -1) {
      cats = <any[]> await page.$$eval('#hmenu-content > ul > li a[href*="gp/browse.html"]', (links) =>
        links.map((link) => [link.href, link.textContent || link.innerText])
      );
      cats = cats.filter(isNotExcluded).map(([i]) => i);
    }
    else {
      // Retrieve the href of each subcategory
      cats = <any[]> await page.$$eval('#hmenu-content > ul > li a[href*="/s?"]', (links) =>
        links.map((link) => [link.href, link.textContent || link.innerText])
      );
      cats = cats.filter(isNotExcluded).map(([i]) => i);
    }
    await close();
    await cache_set(key, cats);
    console.log(`Update cached categories for ${url}`, cats.length);
  }
  else {
    cats = cachedResult;
    console.log(`Using cached categories for ${url}`, cats);
  }
  let categories = [];

  if (domain.indexOf('amazon.fr') !== -1) {
    const pag1 = await openpage(`https://${domain}`);
    for (const maincat of cats) {
      // Open the category
      const subcats = await scrapeCategories(`${maincat}`, pag1[0], domain);
      categories = categories.concat(subcats);
    }
    await pag1[1].close();
  }
  else {
    categories = categories.concat(cats);
  }

  return categories;
}
