const redis = require("redis");
const client = redis.createClient({ 
    enable_offline_queue: false,
    port: 6379
  });
const {promisify} = require('util');

client.connect();

client.on("ready", ()=> {
  console.log("Redis is Ready_");
});

client.on("error", (err) => {
  console.error(err);
});

async function set(key, value) {
    try {
        console.log('abcx')
        const setAsync = promisify(client.set).bind(client);
        const data = await setAsync(key, value);
        console.log(JSON.stringify(data, null, 2));

        return data;
	} catch (err) {
        console.log("err", err);
	}
}

async function get(key) {
    try {
        const getAsync = promisify(client.get).bind(client);
        const data = await getAsync(key);
        console.log(JSON.stringify(data, null, 2));
        return data;
	} catch (err) {
        console.log("err", err);
	}
}

module.exports = {
  set:set,
	get: get
}