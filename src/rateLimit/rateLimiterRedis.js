const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
// const redisClient = require("../redis/redisService");
// const redis = require("redis");
// const redisClient = redis.createClient({ 
//     enable_offline_queue: false,
//     port: 6379
// });
// const redis = require('redis');
const redis = require('ioredis');
const redisClient = redis.createClient({ enable_offline_queue: false });

redisClient.on("ready", ()=> {
  console.log("Redis is Ready_a");
});

redisClient.on("error", (err) => {
  console.error(err);
});

const accessLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "access_",
    points: 5, // 10 requests
    duration: 10, // per 1 second by IP
    // blockDuration: 
});

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const rateLimiterMiddleware = async (req, res, next) => {
    // console.log(`${req.ip}`);
    accessLimiter.consume(`${req.ip}`, 1)
    .then((_res) => {
        // console.log(`IP: ${req.ip}, response: ${_res}`);
        console.log(`success`)
        next();
    })
    .catch(async (rejRes) => {
        if (rejRes instanceof Error) {
            // Some Redis error
            // Never happen if `insuranceLimiter` set up
            // Decide what to do with it in other case
            console.log(`IP: ${req.ip}, redis-error: ${rejRes}`);
        } else {
            // console.log(`IP: ${req.ip}, error: ${rejRes}`);
            // Can't consume
            // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
            const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
            res.set('Retry-After', String(secs));
            res.status(429).send(`Too Many Requests`);
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