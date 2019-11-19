//Detta ska bli test för att en knapp fungerar

const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  
  await page.goto('http://192.168.99.100:9001/main')
  
  await page.setViewport({ width: 1280, height: 578 })
  
 await page.screenshot({ path: 'screenshot_1.png' })
  
  await page.waitForSelector('.ng-star-inserted > div > app-check-in-form > .mat-raised-button > .mat-button-wrapper')
  await page.click('.ng-star-inserted > div > app-check-in-form > .mat-raised-button > .mat-button-wrapper')
  
  await page.waitForSelector('.mat-form-field #mat-input-4')
  await page.click('.mat-form-field #mat-input-4')

 await page.screenshot({ path: 'screenshot_2.png' })
  
  await browser.close()
})()