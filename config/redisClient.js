const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.connect();

module.exports = client;
