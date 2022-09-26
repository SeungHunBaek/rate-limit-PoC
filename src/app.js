const express = require('express'); 
const app = express();
// const redisClient = redis.createClient(6379,"127.0.0.1");
const redisClient = require('redis').createClient({
  // host : '192.168.219.103',
  // host : 'redis-server',
  // host : 'host.docker.internal',
  host : '127.0.0.1',
  port : 6379,
  legacyMode: true
});
const { RateLimiterRedis } = require('rate-limiter-flexible');

redisClient.connect();
redisClient.on("ready", ()=> {
  console.log("Redis is Ready");
});

redisClient.on("error", (err) => {
  console.error(err);
});


const accessLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'access',
  points: 5, // 5 attempts
  duration: 1, // 1 초당 5회, 1초마다 5개의 point가 생성 
});

app.get('/', async function (req, res) {

  await redisClient.set( "name", "Bobby" );
  console.log(await redisClient.get( "name" ));
  
	res.send('Hello World Express'); 
}); 

app.listen(3000);