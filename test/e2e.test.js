/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const { expect } = require('chai');

const PORT = '9001';
const BASE_URL = process.env.IN_DOCKER ? 'test-frontend' : 'http://localhost';
const HOST_URL = `${BASE_URL}:${PORT}`;
console.log(`Connecting to host url: ${HOST_URL}`);

let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  page = await browser.newPage();
});

describe('Test Website meta information', () => {
  it('page title should be FrontEnd', async () => {
    await page.setViewport({
      width: 1000,
      height: 1000,
    });

    await page.goto(HOST_URL, { waitUntil: 'networkidle2' });

    const pageTitle = await page.title();

    expect(pageTitle).to.equal('FrontEnd');
  });
});
