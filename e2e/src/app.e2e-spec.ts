import { browser, logging } from 'protractor';
import { async } from 'q';
const puppeteer = require('puppeteer');

const sleep = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 3000);
  })
}

describe('workspace-project App', () => {
  
  it('should display welcome message', async () => {
    const browser = await puppeteer.launch({args: [
      'no-sandbox',
      'disable-setuid-sandbox',
    ]});
    const page = await browser.newPage();


    await page.setViewport({
      "width": 1000,
      "height": 1000
    });

    await page.goto('http://localhost:4200');

    await page.keyboard.press('Enter', {delay: 2000});

    const pageTitle = page.title();

    expect(pageTitle).toEqual('FrontEnd');
  });
});
