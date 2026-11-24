import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome' });
const url = 'file://' + process.cwd() + '/index.html';
for (const [name, w, h] of [['desk-top', 1440, 950], ['phone-top', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/${name}.png` });
  if (name === 'desk-top') {
    await page.click('#theme-toggle');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'shots/desk-top-night.png' });
  }
  await ctx.close();
}
await browser.close();
