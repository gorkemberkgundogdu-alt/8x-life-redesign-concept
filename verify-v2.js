const { chromium } = require('playwright-core');
const path = require('node:path');

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = 'http://127.0.0.1:4173/';

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(base, { waitUntil: 'networkidle' });
      const layout = await page.evaluate(() => ({
        viewport: window.innerWidth,
        page: document.documentElement.scrollWidth,
        brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
      }));
      if (layout.page > layout.viewport || layout.brokenImages.length) throw Error(`${width}px layout: ${JSON.stringify(layout)}`);
      await page.getByRole('button', { name: /Menu/ }).click();
      if (await page.locator('.menu-overlay').isHidden()) throw Error(`${width}px menu did not open`);
      if (width === 390) await page.screenshot({ path: path.join(__dirname, 'research', 'screenshots', 'v2-menu-mobile.png') });
      if (width === 1440) {
        await page.locator('.menu-item').first().hover();
        await page.waitForTimeout(250);
        const background = await page.locator('.menu-item').first().evaluate(el => getComputedStyle(el).backgroundColor);
        if (background !== 'rgb(189, 64, 37)') throw Error(`Menu hover color: ${background}`);
        await page.screenshot({ path: path.join(__dirname, 'research', 'screenshots', 'v2-menu-hover-desktop.png') });
      }
      await page.keyboard.press('Escape');
      if (await page.locator('.menu-overlay').isVisible()) throw Error(`${width}px Escape did not close menu`);
      await page.getByRole('tab', { name: /Speed/ }).click();
      if (!await page.getByRole('tabpanel').getByText(/Ship many versions/).isVisible()) throw Error(`${width}px tab did not update`);
      await page.getByRole('tab', { name: /Speed/ }).press('ArrowRight');
      if (await page.getByRole('tab', { name: /80\/20/ }).getAttribute('aria-selected') !== 'true') throw Error(`${width}px keyboard tab did not update`);
      console.log(`${width}px: layout, images, menu, hover, tabs OK`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
