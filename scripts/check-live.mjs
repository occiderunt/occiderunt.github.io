import { chromium } from 'playwright';
const base = 'https://occiderunt.github.io/';
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
const resp = await page.goto(base, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.7);
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160));
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await new Promise(r => setTimeout(r, 800));
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 600));
});
await page.screenshot({ path: 'shots/live-desktop.png', fullPage: true });
const info = await page.evaluate(() => ({
  title: document.title,
  status: 'ok',
  images: [...document.images].map(i => ({ src: i.getAttribute('src'), w: i.naturalWidth })),
  h1: document.querySelector('h1')?.innerText
}));
console.log('HTTP', resp.status(), JSON.stringify(info, null, 2));
console.log('console errors:', errors.length ? errors : 'none');

// 404
const r404 = await page.goto(base + 'nope/', { waitUntil: 'networkidle' });
console.log('404 route status:', r404.status(), 'title:', await page.title());

// asset statuses
for (const p of ['assets/favicon.svg','assets/favicon-32.png','assets/apple-touch-icon.png','assets/og.png','assets/app-bling.jpg','assets/app-synopsis.jpg','assets/app-shimondle.jpg','assets/app-netstudy.jpg','styles.css','script.js','robots.txt','sitemap.xml']) {
  const r = await page.request.get(base + p);
  console.log(p, r.status());
}

// phone
const pctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const pp = await pctx.newPage();
await pp.goto(base, { waitUntil: 'networkidle' });
await pp.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.7);
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
});
await pp.screenshot({ path: 'shots/live-phone.png', fullPage: true });
console.log('phone overflow:', await pp.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await browser.close();
