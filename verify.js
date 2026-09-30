const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();
  const response = await page.goto('https://gorkemberkgundogdu-alt.github.io/8x-life-redesign-concept/', { waitUntil: 'domcontentloaded' });
  await page.locator('.hero-person-front').evaluate(el => el.decode());
  await page.locator('.portrait').first().scrollIntoViewIfNeeded();
  await page.locator('.portrait img').first().evaluate(el => el.decode());
  const result = await page.evaluate(() => ({
    title: document.title,
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    heading: document.querySelector('h1')?.innerText,
    firstPeopleImageLoaded: (() => { const img = document.querySelector('.portrait img'); return img.complete && img.naturalWidth > 0; })(),
    primaryCTA: document.querySelector('.closing .button')?.href,
    candidateCTA: document.querySelector('.closing .under-link')?.href,
  }));
  console.log(JSON.stringify({ status: response.status(), ...result }, null, 2));
  await browser.close();
  if (response.status() !== 200 || result.documentWidth > result.viewport || !result.firstPeopleImageLoaded || !result.primaryCTA.includes('/for-brands') || !result.candidateCTA.includes('/join')) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
