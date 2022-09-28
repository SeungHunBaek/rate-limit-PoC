const express = require('express'); 
const app = express();
const port = 3000;
// const redis = require("./redis/redisService");
// // const redis = require("redis");
// // const client = redis.createClient(6379);

const rateLimiterRedisMiddleware = require('./rateLimit/rateLimiterRedis');
app.use(rateLimiterRedisMiddleware);

let cnt = 0;
app.get('/', async function (req, res) {
  try {
      cnt++;
      // redis.set( `name_${cnt}`, `Bobby_${cnt}`);
      // console.log(cnt)
      res.status(200).set("Content-Type", "text/html").send({a:cnt})
  } catch (err) {
    console.log("err", err);
  }
}); 

process.on('uncaughtException', (err) =>{
  console.error(`[uncaughtException]: ${err}`);
})

app.listen(port)