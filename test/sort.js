//ska bli test för sortera artiklar
const puppeteer = require('puppeteer');
const ScreenshotTester = require('puppeteer-screenshot-tester')
  //let browser;
  //let page;


  /* before(async () => {
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
    }); */
  (async () => {
    const tester = await ScreenshotTester(
      [threshold = 0][, includeAA = false[, ignoreColors = false[, ignoreRectangles = [][, errorSettings = Object]]]]
    )
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('http://192.168.99.100:9001/main')
    //await page.click('<button class="mat-sort-header-button" type="button" aria-label="Change sorting for article_nr">Article #</button>');

    await page.setViewport({ width: 1920, height: 937 })
    await page.screenshot({ path: 'before_sort_article.png' })

    /*  await page.waitForSelector('.ng-star-inserted > div > app-check-in-form > .mat-raised-button > .mat-button-wrapper')
   await page.click('.ng-star-inserted > div > app-check-in-form > .mat-raised-button > .mat-button-wrapper')
   
   await page.waitForSelector('.mat-form-field #mat-input-4')
   await page.click('.mat-form-field #mat-input-4') */

    await page.setViewport({ width: 1920, height: 937 })

    await page.waitForSelector('thead > .mat-header-row > .ng-tns-c14-2 > .mat-sort-header-container > .mat-sort-header-button')
    await page.click('thead > .mat-header-row > .ng-tns-c14-2 > .mat-sort-header-container > .mat-sort-header-button')
    await page.screenshot({ path: 'after_sort_article.png' })

    await browser.close()
  })()
