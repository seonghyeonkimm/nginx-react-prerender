const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const puppeteer = require('puppeteer');
const ssr = require('./ssr');

const PORT = process.env.PORT;
let browserWSEndpoint = null;

const app = express();
app.get('*', async (req, res) => {
  if (!browserWSEndpoint) {
    const browser = await puppeteer.launch();
    browserWSEndpoint = await browser.wsEndpoint();
  }

  const { html, ttRenderMs } = await ssr(process.env.INDEX_HTML_PATH, browserWSEndpoint);
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html);
});

app.listen(PORT, () => console.log(`Prerender server is listening to ${PORT}`));