const getConfig = () => {
  let config = null;

  if(process.env.NODE_ENV == 'prod' ) {
    config = require('../config.prod');
  } else if (process.env.NODE_ENV == 'dev') {
    config = require('../config.dev');
  } else {
    config = require('../config.example');
  }
  return config;
}

module.exports = {
  config: getConfig(),
}
