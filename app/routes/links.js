'use strict';

// Dependencies.

import express   from 'express';
import LinkModel from '../models/link';

//Routes for the links API.

var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    provider: 'http://api.localhost.com',
    owner: 'Luis Gutiérrez'
  });
});

router.route('/links')
  .get(function(req, res) {
    LinkModel.find(function(err, links){
      if(err)
        res.status(500).send(err);

      res.json(links);
    })
  })

  .post(function (req, res) {

    var newLink = { url: LinkModel.correctUrl(req.body.url)};

    if(req.body.shortly)  newLink.shortly = req.body.shortly;

    if(newLink.url == -1) res.status(400).send('Not a valid URL.');

    LinkModel.isShortlyAvailable(newLink)
             .then(LinkModel.urlToLocation)
             .then(LinkModel.checkUrl)
             .then(LinkModel.addShortly)
             .then(LinkModel.createLink)
             .then(function(newLink) {
               newLink.save(function(err, link) {
                 if(err) res.status(500).send(err);

                 res.json(link);
               });
             }, function(err) {
               console.log(err);
               res.status(500).send(err);
             }).catch(function(err) { console.log(err);});

  });

router.route('/links/:shortly')
  .get(function(req, res) {
    LinkModel.findOne( {shortly: req.params.shortly}, function(err, link) {
      if(err) res.status(500).send(err);

      res.json(link);
    });
  })

  .delete(function(req, res) {
      LinkModel.remove( {shortly: req.params.shortly}, function(err, shortly) {
          if (err) res.send(err);

          res.json({ message: 'Successfully deleted' });
      });
  });


module.exports = router;
