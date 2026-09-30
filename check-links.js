const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4173/');
  const links = [...new Set(await page.locator('a[href^="https://"]').evaluateAll(items => items.map(a => a.href)))];
  const results = await Promise.all(links.map(async href => {
    const tab = await browser.newPage();
    try {
      const response = await tab.goto(href, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const status = response?.status();
      const hashTarget = new URL(href).hash;
      const hashFound = !hashTarget || await tab.locator(hashTarget).count() > 0;
      return { href, status, final: tab.url(), hashFound };
    } catch (error) {
      return { href, error: error.message };
    } finally {
      await tab.close();
    }
  }));
  results.forEach(result => console.log(JSON.stringify(result)));
  await browser.close();
  if (results.some(result => result.error || result.status >= 400 || !result.hashFound)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
