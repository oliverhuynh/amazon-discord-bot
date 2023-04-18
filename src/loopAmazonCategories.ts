import axios from 'axios';
import cheerio from 'cheerio';
import { AmazonSite, Product } from './types';
import { openpage } from './searchSingleAmazonSite';
import puppeteer from 'puppeteer';
require('dotenv').config();

async function scrapeCategories(url: string, page: any, domain: AmazonSite) {
  await page.goto(url);
  await page.waitForSelector('.apb-browse-left-nav', {timeout: 5000}).catch(()=>{});
  const categoryLinks = await page.$$eval(
    '.apb-browse-left-nav a',
    (links: Element[]) => links.map(link => link.getAttribute('href')).filter(href => href?.startsWith('/s?'))
  );

  return categoryLinks.map(href => `https://${domain}${href}`);
}

export async function loopAmazonCategories(domain: AmazonSite): Promise<string []> {
  const [page, browser] = await openpage(`https://${domain}`);

  // Wait for the "Departments" menu to appear
  await page.waitForSelector('#nav-hamburger-menu');
  await page.waitForTimeout(2000); // wait for 2 seconds for the menu to appear

  // Click on the "Departments" menu to open it
  await page.click('#nav-hamburger-menu');
  await page.waitForTimeout(4000); // wait for 4 seconds for the menu to appear

  // Wait for the subcategories to appear
  await page.waitForSelector('#hmenu-content > ul > li > a');
  let categories = [];

  if (domain.indexOf('amazon.fr') !== -1) {
    // Find sub categories link under each category
    const mainCategories = await page.$$eval('#hmenu-content > ul > li > a', (links) =>
      links.map((link) => link.href).filter(url => url.indexOf('/gp/browse.html') !== -1)
    );
    await browser.close();
    const pag1 = await openpage(`https://${domain}`);
    for (const maincat of mainCategories) {
      // Open the category
      const subcats = await scrapeCategories(`${maincat}`, pag1[0], domain);
      categories = categories.concat(subcats);
      console.log({subcats});
    }
    await pag1[1].close();
  }
  else {
    // Retrieve the href of each subcategory
    const cats = await page.$$eval('#hmenu-content > ul > li > a', (links) =>
      links.map((link) => link.href).filter(url => url.indexOf('/s?') !== -1)
    );
    await browser.close();
    categories = categories.concat(cats);
  }


  return categories;
}
