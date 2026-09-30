const { chromium } = require('playwright-core');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
    if (!await page.locator('html.intro-pending').count()) throw Error('First visit should show the entrance');
    await page.screenshot({ path: path.join(__dirname, 'research', 'screenshots', 'motion-intro-desktop.png') });
    await page.locator('html:not(.intro-pending):not(.intro-exiting)').waitFor({ timeout: 3000 });
    if (await page.locator('.intro').isVisible()) throw Error('Entrance did not clear');
    await page.locator('.work-step').first().scrollIntoViewIfNeeded();
    await page.locator('.work-step.is-visible').first().waitFor({ timeout: 3000 });
    await page.reload();
    if (await page.locator('html.intro-pending').count()) throw Error('Repeat visit should skip entrance');
    await context.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
    await mobilePage.screenshot({ path: path.join(__dirname, 'research', 'screenshots', 'motion-intro-mobile.png') });
    await mobilePage.locator('html:not(.intro-pending):not(.intro-exiting)').waitFor({ timeout: 3000 });
    await mobile.close();

    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const reducedPage = await reduced.newPage();
    await reducedPage.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
    if (await reducedPage.locator('html.intro-pending, html.motion-enabled').count()) throw Error('Reduced motion should skip entrance and reveals');
    if (!await reducedPage.locator('.hero h1').isVisible()) throw Error('Reduced motion hero should be visible');
    await reduced.close();
    console.log('First visit, exit, scroll reveal, repeat visit, and reduced motion OK');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
