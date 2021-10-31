const axios = require('axios');

const get = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = {get};
