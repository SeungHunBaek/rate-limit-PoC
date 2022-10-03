const express = require('express'); 
const app = express();
const port = 4000;

const rateLimiterRedisMiddleware = require('./rateLimit/rateLimiterRedis');
app.use(rateLimiterRedisMiddleware);

let cnt = 0;
app.get('/', async function (req, res) {
  try {
      res.status(200).set("Content-Type", "text/html").send({a:++cnt})
  } catch (err) {
    console.log("err", err);
  }
}); 

process.on('uncaughtException', (err) =>{
  console.error(`[uncaughtException]: ${err}`);
})

app.listen(port, ()=>{
  process.send(`ready`);
  console.log(`express ready`)
})