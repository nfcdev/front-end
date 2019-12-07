/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const ip = require('ip');

const IP_ADDRESS = process.env.TOOLBOX ? '192.168.99.100' : ip.address();
const PORT = '9001';
const BASE_URL = process.env.IN_DOCKER ? 'test-frontend' : `http://${IP_ADDRESS}`;
const HOST_URL = `${BASE_URL}:${PORT}`;
console.log(`Connecting to host url: ${HOST_URL}`);

let browser;
let page;

function delay(time) {
  return new Promise(((resolve) => {
    setTimeout(resolve, time);
  }));
}

before(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  page = await browser.newPage();
  await page.goto(HOST_URL, { waitUntil: 'networkidle2' });
});


describe('Test Website meta information', () => {
  it('page title should be FrontEnd', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).to.be.equal('FrontEnd');
  });
});

describe('Login', () => {
  it('User should be able to login', async () => {
    await page.waitForSelector('input[name="kortkod"]');
    await page.type('input[name="kortkod"]', 'admon');

    await page.waitForSelector('span[class="mat-button-wrapper"]');
    await page.click('span[class="mat-button-wrapper"]');
  });
});

describe('Search bar', async () => {
  it('Should search for "111111"', async () => {
    await page.waitForSelector('input[formcontrolname="searchcomponent"]');
    await page.type('input[formcontrolname="searchcomponent"]', '111111\n');
  });

  it('Should test that search was completed', async () => {
    await page.waitForSelector('mat-chip[class="mat-chip mat-primary mat-standard-chip mat-chip-with-trailing-icon ng-star-inserted"]');
    element = await page.$('mat-chip[class="mat-chip mat-primary mat-standard-chip mat-chip-with-trailing-icon ng-star-inserted"]');
    expect('mat-chip[class="mat-chip mat-primary mat-standard-chip mat-chip-with-trailing-icon ng-star-inserted"]').not.to.be.null;
  });

  it('Should remove the search and return', async () => {
    await page.waitForSelector('button[id="clear"]');
    await page.click('button[id="clear"]');
    element = await page.$('mat-chip[class="mat-chip mat-primary mat-standard-chip mat-chip-with-trailing-icon ng-star-inserted"]');
    expect(element).to.be.null;
  });
});

describe('Buttons', async () => {
  it('Should test button "Hantera System"', async () => {
    await page.waitForSelector('.row > .button > app-manage-system-dialog > .mat-raised-button > .mat-button-wrapper');
    await page.click('.row > .button > app-manage-system-dialog > .mat-raised-button > .mat-button-wrapper');
    await delay(1500);
    await page.keyboard.down('Escape');
  });

  it('Should test button "Visualisering"', async () => {
    await page.waitForSelector('.row > .button > app-data-visualization > .mat-raised-button > .mat-button-wrapper');
    await page.click('.row > .button > app-data-visualization > .mat-raised-button > .mat-button-wrapper');
    await delay(1500);
    await page.keyboard.down('Escape');
  });

  it('Should testing "Check-in + package"-button (no check in should be completed)', async () => {
    await page.waitForSelector('app-check-in-drop-down');
    await page.click('app-check-in-drop-down');

    await page.waitForSelector('.mat-menu-panel > .mat-menu-content > app-package-check-in > .mat-menu-item');
    await page.click('.mat-menu-panel > .mat-menu-content > app-package-check-in > .mat-menu-item');

    await page.waitForSelector('input[formcontrolname="reference_number"]');
    await page.type('input[formcontrolname="reference_number"]', '111111\n');
    await page.keyboard.down('Escape');
  });

  it('Should testing "Check-in + material"-button(no check in should be completed)', async () => {
    await page.waitForSelector('app-check-in-drop-down');
    await page.click('app-check-in-drop-down');
    await page.waitForSelector('.mat-menu-panel > .mat-menu-content > app-material-check-in > .mat-menu-item');
    await page.click('.mat-menu-panel > .mat-menu-content > app-material-check-in > .mat-menu-item');

    await page.waitForSelector('input[formcontrolname="material_number"]');
    await page.type('input[formcontrolname="material_number"]', '111111-01\n');
    await page.keyboard.down('Escape');
  });

  it('Should test button "Checka ut + package" (no check out should be performed)', async () => {
    await page.waitForSelector('div > .row > .button > .mat-menu-trigger > .mat-button-wrapper');
    await page.click('div > .row > .button > .mat-menu-trigger > .mat-button-wrapper');

    await page.waitForSelector('app-package-check-out');
    await page.click('app-package-check-out');

    await page.waitForSelector('input[formcontrolname="package"]');
    await page.type('input[formcontrolname="package"]', '111111-K01\n');
    await page.keyboard.down('Escape');
  });

  it('Should test button "Checka ut + material" (no check out should be performed)', async () => {
    await page.waitForSelector('div > .row > .button > .mat-menu-trigger > .mat-button-wrapper');
    await page.click('div > .row > .button > .mat-menu-trigger > .mat-button-wrapper');

    await page.waitForSelector('app-material-check-out');
    await page.click('app-material-check-out');

    await page.waitForSelector('input[formcontrolname="material_number"]');
    await page.type('input[formcontrolname="material_number"]', '111111\n');
    await page.keyboard.down('Escape');
  });
});
