require('dotenv').config(); // path위치 확인 할것
const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const morgan = require('morgan');
const rateLimiterRedisMiddleware = require('./rateLimit/rateLimiterRedis');

const app = express();
app.set('port', process.env.PORT || 4000);
// Todo
// 돌핀 배포시 환경에따라 다르게 설정
app.use(morgan('dev'));
app.use(timeout('10s'));
app.use(bodyParser.json({ extended: true }));
app.use(rateLimiterRedisMiddleware);

let cnt = 0;
app.get('/', async (req, res) => {
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

app.listen(app.get('port'), () => {
  console.log(`[express] ready`);
});
