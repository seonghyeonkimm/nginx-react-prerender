const url = require('url');
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
    const browser = await puppeteer.launch({ headless: true });
    browserWSEndpoint = await browser.wsEndpoint();
  }

  const requestUrl = `${process.env.BASE_URL}${req.url}`;
  const { protocol, hostname, pathname } = url.parse(requestUrl);
  const targetUrl = `${protocol}//${hostname}${pathname}`;
  const { html, ttRenderMs } = await ssr(targetUrl, browserWSEndpoint);
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html);
});

const server = app.listen(PORT, () => console.log(`Prerender server is listening to ${PORT}`));
const shutDown = async () => {
  if (browserWSEndpoint) {
    const browser = await puppeteer.connect({ browserWSEndpoint });
    await browser.close();
  };

  server.close();
};

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
