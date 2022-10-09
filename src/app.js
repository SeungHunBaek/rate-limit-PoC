const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const app = express();
const port = 4000;
const rateLimiterRedisMiddleware = require('./rateLimit/rateLimiterRedis');

let cnt = 0;
app.use(timeout('10s'));
app.use(bodyParser.json({ extended: true }));
app.use(rateLimiterRedisMiddleware);

app.get('/', async function (req, res) {
  try {
    console.log(`[app.js] End`);
    res
      .status(200)
      .set('Content-Type', 'text/html')
      .send({ a: (cnt += 1) });
  } catch (err) {
    console.log(`[/:Error], ${JSON.stringify(err, null, 2)}`);
  }
});

process.on('uncaughtException', (err) => {
  console.error(`[uncaughtException]: ${err}`);
});

app.listen(port, () => {
  console.log(`[express] ready`);
});
