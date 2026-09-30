const { chromium } = require('playwright-core');
const fs = require('node:fs/promises');
const path = require('node:path');

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const shots = [
  { name: 'original-home', url: 'https://8x.life/' },
  { name: 'original-manifesto', url: 'https://8x.life/manifesto' },
  { name: 'original-team', url: 'https://8x.life/team' },
  { name: 'reference-talent', url: 'https://e2.vc/talent' },
  { name: 'reference-team', url: 'https://e2.vc/team' },
  { name: 'reference-friends', url: 'https://e2.vc/friends' },
  { name: 'redesign', url: 'http://127.0.0.1:4173/' },
];

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  await fs.mkdir(path.join(__dirname, 'research', 'screenshots'), { recursive: true });
  for (const device of [
    { label: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false },
    { label: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const shot of shots) {
      try {
        await page.goto(shot.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(2500);
        const output = path.join(__dirname, 'research', 'screenshots', `${shot.name}-${device.label}.png`);
        await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
        console.log(output);
      } catch (error) {
        console.error(`${shot.name}-${device.label}: ${error.message}`);
      }
    }
    await context.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
