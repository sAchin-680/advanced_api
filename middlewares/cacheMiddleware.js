const redisClient = require('../config/redisClient');

// Cache middleware
const cache = async (req, res, next) => {
  const { id } = req.params;

  try {
    const cachedData = await redisClient.get(`product:${id}`);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    console.error('Redis cache error:', error);
    next();
  }
};

module.exports = cache;
