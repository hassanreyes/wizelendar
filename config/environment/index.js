'use strict';

// Dependencies.

import _ from 'lodash';

// All configurations will extend these options

var all = {
  env: process.env.NODE_ENV,
  port: process.env.port || 3000,
  mongoDB: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

// Export the config object based on the NODE_ENV

module.exports = function(env){
  console.log(env);
  return _.merge(all, require('./' + env + '.js') || {});
}
