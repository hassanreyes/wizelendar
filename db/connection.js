/**
 *  Setup database connection and configuration.
 */

// Dependencies

import mongoose from 'mongoose';

// Connect to MongoDB

module.exports = function(config) {
  mongoose.createConnection(config.mongoDB.uri, config.mongoDB.options);
  mongoose.connection.on('error', function(err) {
   console.log('MongoDB connection error: ' + err);
   process.exit(-1);
  });
}
