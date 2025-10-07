const puppeteer = require('puppeteer');

(async () => {
  const url = 'http://localhost:58698';
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 800 });

  console.log('loading', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // wait for takeover nav trigger
  try {
    await page.waitForSelector('.nav-hover', { timeout: 10000 });
  } catch (e) {
    console.error('nav-hover not found');
    await browser.close();
    process.exit(1);
  }

  // open nav by clicking nav-hover
  await page.click('.nav-hover');
  await page.waitForTimeout(500);

  // find a takeover link
  const link = await page.$('.takeover-nav-link a, .takeover-nav-link');
  if (!link) {
    console.error('no takeover link found');
    await browser.close();
    process.exit(1);
  }

  // capture before
  await page.screenshot({ path: 'before.png', fullPage: false });

  // click the first link
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }).catch(() => {}),
    link.click(),
  ]);

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'after.png', fullPage: false });

  console.log('screenshots saved: before.png, after.png');
  await browser.close();
})();
