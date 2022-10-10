const morgan = require('morgan');
const uuid = require('node-uuid');
const Logger = require('./logger');

// logger의 http 레벨을 사용해서 stream에 들어오는 모든 로그 출력
const stream = {
  write: (message) => {
    Logger.http(`${message}`);
    // Logger.http(`${message.replace('\n', '')}`);
  }
};

// http로그도 항상 필요한듯 삭제예정?
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

// response status 표현
// 개발할때 보기는 좋은데 prod환경에서도 color입히는게 필요할까(정식버전에서 삭제??)
morgan.token('status', (req, res) => {
  let color;

  if (res.statusCode < 300) color = '\x1B[32m'; // green
  else if (res.statusCode < 400) color = '\x1B[36m'; // cyan
  else if (res.statusCode < 500) color = '\x1B[33m'; // yellow
  else if (res.statusCode < 600) color = '\x1B[31m'; // red
  else color = `\x1b[0m`; /* 글자색 초기화 */

  return `${color}${res.statusCode}\x1b[35m` /* 보라색 */;
});

// request정보 출력
morgan.token('request', (req) => {
  return `${JSON.stringify(req.body)}`;
});

// Id를 할까 말까
morgan.token('id', (req) => {
  return req._id;
});

// http로그 출력 형식
const morganMiddleware = morgan(
  "[:status - :method] | ':url' | 응답시간=:response-time ms (:res[content-length]Line) | request=:request",
  { stream, skip }
);

const assignId = (req, res, next) => {
  req._id = uuid.v4();
  next();
};

module.exports = {
  morganMiddleware,
  assignId
};
