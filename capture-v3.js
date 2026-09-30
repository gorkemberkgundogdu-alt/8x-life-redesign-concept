const { chromium } = require('playwright-core');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  for (const [label, width] of [['desktop', 1440], ['mobile', 390]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.locator('.system').screenshot({ path: path.join(__dirname, 'research', 'screenshots', `v3-network-${label}.png`) });
    await page.locator('.closing').screenshot({ path: path.join(__dirname, 'research', 'screenshots', `v3-footer-${label}.png`) });
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
