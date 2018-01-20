'use strict';

// Dependencies.

import express   from 'express';
import _         from 'lodash';
import LinkModel from '../models/link';

var router = express.Router();

// Redirection route.

router.get('/:shortly', function (req, res) {
  var shortly = req.params.shortly,
      url     = LinkModel.findOne({shortly: shortly}, {url:1, _id:0}, cb);

  function cb(err, link) {

    if(err) return res.status(500).send(err);
    if(_.isEmpty(link)) return res.status(404).send('Not a valid short.ly  :(');

    res.redirect(301, link.url);
  }
});

module.exports = router;
