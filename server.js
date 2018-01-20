/**
 *  Main backend app file for short.ly API.
 */

'use strict';

// Set default node enviroment to development.

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Dependencies

import express  from 'express';
import mongoose from 'mongoose';

import createConfig  from './config/environment';
import connection    from './db/connection';
import configExpress from './config/express';
import setupRoutes   from './app/routes';

// Connect to MongoDB & Setup server.

var config = createConfig(env);
connection(config);

const app = express();
configExpress(app);
setupRoutes(app);

app.listen(config.port);
console.log('Server listening on port: ' + config.port);

// Export the app

module.exports = app;
