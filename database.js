const monk = require('monk');

module.exports = (config) => monk(config.url);
