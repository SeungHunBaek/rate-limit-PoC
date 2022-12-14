const redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const logger = require('../loggerService/logger');

const redisClient = redis.createClient({
  // host: 'host.docker.internal',
  port: 6379,
  enable_offline_queue: false
});

redisClient.on('ready', () => {
  logger.info('[Redis] Ready');
});

redisClient.on('error', (err) => {
  logger.error(`[Redis] Error: ${JSON.stringify(err, null, 2)}`);
});

const accessLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ccxt-rate-limit-',
  points: 30, // 사용가능한 포인트
  duration: 1 // 충전되는 시간
  // timeoutMs:
  // blockDuration:
});

// eslint-disable-next-line no-promise-executor-return
// const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const rateLimiterMiddleware = async (req, res, next) => {
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  accessLimiter
    .consume(`${IP}`, 1)
    .then((_res) => {
      // console.log(`[success]IP: ${IP}`);
      logger.info(`[success] ${_res}`);
      next();
    })
    .catch(async (rejRes) => {
      // Redis가 에러를 return했을때
      // bobby: 메모리로 대응하도록 해? 바로 에러 나는거 확인하고 대응하는게 좋을듯
      if (rejRes instanceof Error) {
        // Some Redis error
        // Never happen if `insuranceLimiter` set up
        // Decide what to do with it in other case
        logger.error(`[Error]: IP: ${IP}, redis-error: ${rejRes}`);
      } else {
        // rateLimiterMiddleware(req, res, next);
        // console.error(`IP:${IP}, error: ${rejRes}`);
        // // Can't consume
        // // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
        // res.set('Retry-After', String(secs));
        // res.status(429).send(`Too Many Requests`);
        // 충전시간이 필요한경우
        // eslint-disable-next-line no-lonely-if
        if (parseInt(rejRes.msBeforeNext, 10) > -1) {
          logger.warn(`remain time: ${rejRes.msBeforeNext}ms, rejRes: ${rejRes}`);
          res.status(429).send(`Too Many Request`);
          // const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
          // 기다리다가 타임아웃된 event
          // if (req.timedout) {
          //   logger.warn(`[Timeout] remain time: ${rejRes.msBeforeNext}ms`);
          //   // res.status(504).send(`Gateway Timeout`); // express-timeout이미 보냄
          // } else {
          //   logger.warn(`[retry] remain time: ${rejRes.msBeforeNext}ms, rejRes: ${rejRes}`);
          //   res.status(429).send(`Too Many Request`);
          //   // await sleep(rejRes.msBeforeNext);
          //   // rateLimiterMiddleware(req, res, next);
          // }
          // 기타에러
        } else {
          logger.error(`Unknown Error`);
          res.status(503).send(`Unknown Error`);
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
