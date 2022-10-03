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
  console.log("Redis is Ready");
});

redisClient.on("error", (err) => {
  console.error(`Redis Error: ${JSON.stringify(err, null, 2)}`);
});

const accessLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ccxt-rate-limit-',
    points: 2, // 사용가능한 포인트 
    duration: 1, // 충전되는 시간
    // blockDuration: 
});

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
__cnt = 0;
const rateLimiterMiddleware = async (req, res, next) => {
    const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const startTime = new Date().getTime() / 1000;
    let _startTime = performance.now()
    console.log(__cnt++);
    accessLimiter.consume(`${IP}`, 1)
    .then((_res) => {
        // console.log(`IP: ${IP}, response: ${_res}`);
        console.log(`[success]IP: ${IP}`);
        next();
        const endTime = new Date().getTime() / 1000;
        const _endTime = performance.now()
        console.log(`[processing_time] ${endTime - startTime}ms`);
        console.log(`[processing_time] ${_endTime - _startTime}ms`);
    })
    .catch(async (rejRes) => {
        // Redis가 에러를 return했을때
        // bobby: 메모리로 대응하도록 해? 바로 에러 나는거 확인하고 대응하는게 좋을듯
        if (rejRes instanceof Error) {
            // Some Redis error
            // Never happen if `insuranceLimiter` set up
            // Decide what to do with it in other case
            console.log(`[Error]: IP: ${IP}, redis-error: ${rejRes}`);
        } else {
          // rateLimiterMiddleware(req, res, next);
            // console.error(`IP:${IP}, error: ${rejRes}`);
            // // Can't consume
            // // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
            // res.set('Retry-After', String(secs));
            // res.status(429).send(`Too Many Requests`);
            // 충전시간이 필요한경우
            if(parseInt(rejRes.msBeforeNext) > -1) {
              // const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
              console.log(`[retry] remain time: ${rejRes.msBeforeNext}ms, rejRes: ${rejRes}`);
              rateLimiterMiddleware(req, res, next);
            // 기타 알 수 없는 에러
            } else {
              console.log(`429: ${rejRes.msBeforeNext}`);
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