import { chromium } from 'playwright';

const url = 'file://' + process.cwd() + '/index.html';
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];

async function shoot(name, width, height, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`${name} pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `shots/${name}-top.png` });
  // walk the page so scroll reveals and lazy images fire
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 140));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 500));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `shots/${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const height2 = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${name}: overflow=${overflow} height=${height2}`);
  if (opts.night) {
    await page.click('#theme-toggle');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `shots/${name}-night.png`, fullPage: true });
    await page.click('#theme-toggle');
  }
  if (opts.sections) {
    for (const id of opts.sections) {
      await page.locator('#' + id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `shots/${name}-${id}.png` });
    }
  }
  await ctx.close();
}

await shoot('desktop', 1440, 950, { night: true, sections: ['work', 'about'] });
await shoot('phone', 390, 844, { night: true });

// link and structure checks
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
const info = await page.evaluate(() => ({
  title: document.title,
  projects: document.querySelectorAll('.project').length,
  things: document.querySelectorAll('.things li').length,
  images: [...document.images].map(i => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })),
  links: document.querySelectorAll('a[href]').length,
  h1: document.querySelector('h1')?.innerText.replace(/\n/g, ' / '),
  theme: document.documentElement.dataset.theme || 'paper'
}));
console.log(JSON.stringify(info, null, 2));
console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
