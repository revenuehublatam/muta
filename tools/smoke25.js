const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const results = [];
  async function run(label, ctxOpts, shot) {
    const ctx = await browser.newContext(ctxOpts);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));
    await page.goto('http://localhost:8080/', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => { try { return JSON.parse(document.getElementById('muta-state').textContent).generation } catch (e) { return 'ERR ' + e.message } });
    const hud = await page.evaluate(() => (document.querySelector('#hud .gen') || {}).textContent || '');
    await page.click('#twFab');
    await page.waitForSelector('#twWrap.open', { timeout: 15000 });
    await page.waitForTimeout(1200);
    const recetaBtn = await page.isVisible('#twReceta');
    if (shot) await page.screenshot({ path: `/tmp/shot-${label}-tiempo.png` });
    await page.click('#twReceta');
    await page.waitForSelector('#ckWrap.open', { timeout: 15000 });
    await page.waitForTimeout(800);
    const cards = await page.locator('.ckCard').count();
    const doradaTag = await page.locator('.dia-tag').first().textContent().catch(() => '');
    const goldEra = await page.evaluate(() => !!document.querySelector('#ckEras button.gold'));
    await page.locator('.ck-cook').first().click();
    await page.waitForTimeout(600);
    const prog = await page.locator('#ckProg').textContent();
    await page.locator('#ckEras button').nth(3).click();
    await page.waitForTimeout(500);
    const heroAfterNav = await page.locator('#ckHero .y').textContent();
    const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
    await page.click('#ckIcs');
    const download = await dl;
    let icsOk = false, icsInfo = '';
    if (download) {
      const p = await download.path();
      const fs = require('fs'); const txt = fs.readFileSync(p, 'utf8');
      icsOk = txt.includes('BEGIN:VCALENDAR') && (txt.match(/BEGIN:VEVENT/g) || []).length === 7 && txt.includes('muta.revenuehub.cloud/?g=');
      icsInfo = 'events=' + (txt.match(/BEGIN:VEVENT/g) || []).length;
    }
    if (shot) await page.screenshot({ path: `/tmp/shot-${label}-cocina.png` });
    await page.click('#ckX'); await page.waitForTimeout(300);
    await page.click('#twX'); await page.waitForTimeout(300);
    await page.click('#btnArchive'); await page.waitForTimeout(500);
    const playCocina = await page.isVisible('#playCocina');
    results.push({ label, state, hud, recetaBtn, cards, doradaTag: (doradaTag || '').trim(), goldEra, prog: (prog || '').trim(), heroAfterNav: (heroAfterNav || '').trim(), icsOk, icsInfo, playCocina, errors: errors.slice(0, 6) });
    await ctx.close();
  }
  await run('desktop', { viewport: { width: 1440, height: 900 } }, true);
  await run('mobile', { ...devices['iPhone 13'] }, true);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1) });
