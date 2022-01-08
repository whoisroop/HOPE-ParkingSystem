const NodeGeocoder = require('node-geocoder');

//TO ACCESS ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({ path: "./configs/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,

  // Optional depending on the providers
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;