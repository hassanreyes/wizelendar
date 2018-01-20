/**
*  Main app routes
*/

'use strict';

// Dependencies.

import linkRouter     from './links';
import redirectRouter from './redirect';

module.exports = function(app) {

  // Set routes for the API using respective namespaces and routers.

  app.use('/api', linkRouter);
  app.use(redirectRouter);

};
