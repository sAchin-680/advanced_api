const axios = require('axios');
require('dotenv').config();

// Function to get apps from Heroku
const getHerokuApps = async () => {
  try {
    const herokuToken = process.env.HEROKU_API_TOKEN;

    const response = await axios.get('https://api.heroku.com/apps', {
      headers: {
        Authorization: `Bearer ${herokuToken}`,
        Accept: 'application/vnd.heroku+json; version=3',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching apps from Heroku:', error);
    throw error;
  }
};

module.exports = {
  getHerokuApps,
};
