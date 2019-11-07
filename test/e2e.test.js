/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const ip = require('ip');
// asd
const IP_ADDRESS = ip.address();

const PORT = '9001';
const BASE_URL = process.env.IN_DOCKER ? 'test-frontend' : `http://${IP_ADDRESS}`;
const HOST_URL = `${BASE_URL}:${PORT}`;
console.log(`Connecting to host url: ${HOST_URL}`);

let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 100,
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


describe('Login', () => {
  it('User should be able to login', async () => {
    await page.goto(HOST_URL, { waitUntil: 'networkidle2' });

    await page.type('input[formcontrolname="username"]', 'Hello world!');
    await page.type('input[formcontrolname="password"]', 'password');
    await page.waitForSelector('button[type=submit]');
    await page.click('button[type=submit]');
  });
});
