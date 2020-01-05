const puppeteer = require('puppeteer');

// TODO: 나중에 elasticcache로 대체해야 합니다.
const RENDER_CACHE = new Map();
const DEFAULT_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <title>Nginx React Prerender Application</title>
  </head>
  <body />
</html>
`;
async function ssr(url, browserWSEndpoint) {
  if (RENDER_CACHE.has(url)) {
    return {
      html: RENDER_CACHE.get(url),
      ttRenderMs: 0,
    };
  }

  const start = Date.now();
  let html;
  try {
    const browser = await puppeteer.connect({ browserWSEndpoint });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForFunction(
      'window.prerenderReady === true',
      { timeout: 3000 },
    );
    html = await page.content();
    await page.close();
    browser.disconnect();

    RENDER_CACHE.set(url, html);
  } catch (e) {
    html = DEFAULT_HTML;
  }

  const ttRenderMs = Date.now() - start;
  return { html, ttRenderMs };
}

module.exports = ssr;
