import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
for (const w of [1280, 1100, 980, 901, 820]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('https://occiderunt.github.io/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `shots/width-${w}.png` });
  const box = await p.evaluate(() => {
    const h = document.querySelector('h1').getBoundingClientRect();
    const f = document.querySelector('.facts').getBoundingClientRect();
    return { h1: [h.left, h.top, h.right, h.bottom], facts: [f.left, f.top, f.right, f.bottom], overflow: document.documentElement.scrollWidth - innerWidth };
  });
  console.log(w, JSON.stringify(box));
  await c.close();
}
await b.close();
