// Grading capture for the off-script CSS layout. For each story it screenshots
// the reference Storybook render (the oracle, LEFT) beside the matching cell of
// the actually-generated preview card (RIGHT), and tiles them into one sheet
// per component at .design-sync/.cache/compare/<Name>.png. You then Read the
// sheets and grade match/close/mismatch (the card cell HTML is the scraped
// Storybook DOM, so a faithful pipeline matches by construction; the pair is
// what catches a theme/CSS-closure gap the validator's render check can't see).
//
// Run: node .design-sync/grade-capture.mjs [--components A,B]

import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const SBREF_REL = '.design-sync/sb-reference';
const CACHE = resolve(REPO, '.design-sync/.cache/compare');
const only = (() => {
  const i = process.argv.indexOf('--components');
  return i > 0 ? new Set(process.argv[i + 1].split(',').map((s) => s.trim())) : null;
})();

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json' };
function serve(dir) {
  const srv = createServer((req, res) => {
    try {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = join(dir, p);
      if (!existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' });
      res.end(readFileSync(f));
    } catch { res.writeHead(500); res.end(); }
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port })));
}

function loadComponents() {
  const idx = JSON.parse(readFileSync(join(REPO, SBREF_REL, 'index.json'), 'utf8'));
  const byKey = new Map();
  for (const e of Object.values(idx.entries)) {
    if (e.type !== 'story') continue;
    const group = e.title.split('/')[0].trim();
    const name = e.importPath.split('/').pop().replace(/\.stories\.\w+$/, '');
    if (only && !only.has(name)) continue;
    if (!byKey.has(e.title)) byKey.set(e.title, { name, group, stories: [] });
    byKey.get(e.title).stories.push({ id: e.id, name: e.name });
  }
  return [...byKey.values()];
}

const b64 = (buf) => `data:image/png;base64,${buf.toString('base64')}`;

async function main() {
  mkdirSync(CACHE, { recursive: true });
  const comps = loadComponents();
  const { srv, port } = await serve(REPO);
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 760 }, colorScheme: 'light', deviceScaleFactor: 1 });
  const sheetPage = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });

  for (const comp of comps) {
    const cardUrl = `${base}/ds-bundle/components/${comp.group}/${comp.name}/${comp.name}.html`;
    const rows = [];
    for (let i = 0; i < comp.stories.length; i++) {
      const story = comp.stories[i];
      let sbImg = '', dsImg = '';
      // LEFT — Storybook oracle
      try {
        await page.goto(`${base}/${SBREF_REL}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'load', timeout: 20000 });
        await page.waitForSelector('#storybook-root', { state: 'attached', timeout: 10000 });
        await page.waitForFunction(() => document.querySelector('#storybook-root')?.innerHTML.trim().length > 0, { timeout: 8000 }).catch(() => {});
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(200);
        await page.evaluate(() => { if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); });
        const el = await page.$('#storybook-root');
        // Fixed/portal content (modals/toasts) contributes no layout box to the
        // root — element screenshot would be empty. Fall back to the viewport.
        const box = el ? await el.boundingBox() : null;
        sbImg = b64((el && box && box.height >= 12 && box.width >= 12)
          ? await el.screenshot()
          : await page.screenshot());
      } catch (e) { sbImg = ''; }
      // RIGHT — generated card cell i
      try {
        await page.goto(cardUrl, { waitUntil: 'load', timeout: 20000 });
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(150);
        const cell = await page.$(`.ds-cell:nth-of-type(${i + 1})`);
        dsImg = cell ? b64(await cell.screenshot()) : '';
      } catch (e) { dsImg = ''; }
      const cellImg = (src) => src ? `<img src="${src}" style="max-width:640px;max-height:420px;border:1px solid #ddd;background:#fff;object-fit:contain">` : `<div style="width:300px;height:80px;display:flex;align-items:center;justify-content:center;color:#c00;border:1px solid #c00">no render</div>`;
      rows.push(`<tr><td style="font:600 13px system-ui;padding:8px;color:#222;vertical-align:top;white-space:nowrap">${story.name}</td><td style="padding:8px;text-align:center"><div style="font:11px system-ui;color:#888">STORYBOOK (oracle)</div>${cellImg(sbImg)}</td><td style="padding:8px;text-align:center"><div style="font:11px system-ui;color:#888">CARD (preview)</div>${cellImg(dsImg)}</td></tr>`);
    }
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f4f5;padding:12px"><div style="font:700 18px system-ui;color:#111;padding:6px 8px">${comp.group} / ${comp.name} — ${comp.stories.length} stories</div><table style="border-collapse:collapse;background:#fff">${rows.join('')}</table></body></html>`;
    await sheetPage.setContent(html, { waitUntil: 'load' });
    await sheetPage.evaluate(() => Promise.all([...document.images].map((im) => im.decode().catch(() => {}))));
    const out = join(CACHE, `${comp.name}.png`);
    await sheetPage.screenshot({ path: out, fullPage: true });
    console.error(`sheet: ${comp.name} (${comp.stories.length} stories) → ${out}`);
  }
  await browser.close();
  srv.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
