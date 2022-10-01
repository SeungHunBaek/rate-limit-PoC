const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
// const redisClient = require("../redis/redisService");
// const redis = require("redis");
// const redisClient = redis.createClient({ 
//     enable_offline_queue: false,
//     port: 6379
// });
// const redis = require('redis');
const redis = require('ioredis');
const redisClient = redis.createClient({ 
  // host: 'host.docker.internal',
  port: 6379,
  enable_offline_queue: false 
});
redisClient.on("ready", ()=> {
  console.log("Redis is Ready_a");
});

redisClient.on("error", (err) => {
  console.error(err);
});

const accessLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "access_",
    points: 10, // 사용가능한 포인트 
    duration: 1, // 충전되는 시간
    // blockDuration: 
});

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const rateLimiterMiddleware = async (req, res, next) => {
    const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    accessLimiter.consume(`${IP}`, 1)
    .then((_res) => {
        // console.log(`IP: ${IP}, response: ${_res}`);
        console.log(`IP:${IP}, success`)
        next();
    })
    .catch(async (rejRes) => {
        if (rejRes instanceof Error) {
            // Some Redis error
            // Never happen if `insuranceLimiter` set up
            // Decide what to do with it in other case
            console.log(`IP: ${IP}, redis-error: ${rejRes}`);
        } else {
          // rateLimiterMiddleware(req, res, next);
            // console.log(`IP:${IP}, error: ${rejRes}`);
            // // Can't consume
            // // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
            // res.set('Retry-After', String(secs));
            // res.status(429).send(`Too Many Requests`);
            
            if(parseInt(rejRes.msBeforeNext) > 0) {
              // const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
              console.log(`다시: ${rejRes.msBeforeNext}`);
              rateLimiterMiddleware(req, res, next);
            } else {
              res.status(429).send(`Too Many Requests`);
            }
        }
      });
};


module.exports = rateLimiterMiddleware;


// const redis = require('redis');
// const {RateLimiterRedis} = require('rate-limiter-flexible');

// const redisClient = redis.createClient({
//   host: '127.0.0.1',
//   port: 6379,
//   enable_offline_queue: false,
// });
// redisClient.connect();

// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: 'middleware',
//   points: 10, // 10 requests
//   duration: 1, // per 1 second by IP
// });

// const rateLimiterMiddleware = (req, res, next) => {
//   rateLimiter.consume(req.ip)
//     .then(() => {
//       next();
//     })
//     .catch(() => {
//       res.status(429).send('Too Many Requests');
//     });
// };

// module.exports = rateLimiterMiddleware;