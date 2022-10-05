const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const timeout = require('connect-timeout');
const port = 4000;

const rateLimiterRedisMiddleware = require('./rateLimit/rateLimiterRedis');

let cnt = 0;
// const haltOnTimedout = (req, res, next) => {
//   if (!req.timedout) {
//     console.log(`[app.js] req.timedout: ${req.timedout}`);
//     next();
//   } else {
//     console.log(`[app.js] req.timedout: ${req.timedout}`);
//     res.status(504).send(`[app.js] Gateway Timeout`); 
//   }
// }
app.use(timeout('10s'));
app.use(bodyParser.json({ extended: true }))
// app.use(haltOnTimedout);
app.use(rateLimiterRedisMiddleware);
app.get('/', async function (req, res) {
  try {
      console.log(`[app.js] End`);
      res.status(200).set("Content-Type", "text/html").send({a:++cnt})
  } catch (err) {
    console.log("err", err);
  }
}); 

process.on('uncaughtException', (err) =>{
  console.error(`[uncaughtException]: ${err}`);
})

app.listen(port, ()=>{
  // process.send(`ready`);
  console.log(`express ready`)
})
