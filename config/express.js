/**
*  Express.js Configuration
*/

'use strict';

import bodyParser from 'body-parser';
import cors       from 'cors';

module.exports = (app) => {
  app.set('case sensitive routing', true);
  app.use(cors());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    res.header('Content-Type','application/json');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });
}
