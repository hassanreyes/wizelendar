'use strict';

// Dependencies.

import _        from 'lodash';
import mongoose from 'mongoose';

var Schema = mongoose.Schema;

// Define Dictionary.

var dic = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
           'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
           'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
           'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
           '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '$', '-', '_',
           '.', '+', '!', '*', '(', ')', ','];

// Define schema & model.

var linkSchema = new Schema({
  url:     { type: String, require: true},
  shortly: { type: String, require: true, unique: true}
});

/*
  Link#correctUrl
    this function is used to correct or check if a url
    is valid.
*/

linkSchema.statics.correctUrl = function (url) {
  return url;
}

/*
  Link#isShortlyAvailable
    this function is used to check if a shortly is already in
    use for a link.
*/

linkSchema.statics.isShortlyAvailable = function(newLink) {

  return new Promise(function (fulfill, reject) {
    var model   = mongoose.model('Link', linkSchema);

    // If no shortly was provided fulfill promise.

    var hasCustomShortly = newLink.hasOwnProperty('shortly');
    if(!hasCustomShortly) return fulfill(newLink);

    model.findOne({shortly: newLink.shortly}, function(err, link) {

      if(err) return reject(err);

      if(!_.isEmpty(link)) return reject('That shortly has already been taken.');

      fulfill(newLink);
    });
  });
}

/*
  Link#urlToLocation
    this function is used to substitute the url given with the
    location of the response headers when a get is sent to it.
    This way we ensure no duplicates are being saved in our db
    for tiny urls without custom links.
*/

linkSchema.statics.urlToLocation = function (newLink) {

  return new Promise(function (fulfill, reject) {
    http.get(newLink.url, function(res) {
      newLink.url = res.fetchedUrls[0];
      fulfill(newLink);
      return res.resume();

    }).on('error', function(err) {
      return reject(err);
    });
  });
}

/*
  Link#checkUrl
    this function is used to check if there is already a link
    using the url provided if no shortly was given; if that is
    the case the method will do nothing.
*/

linkSchema.statics.checkUrl = function (newLink) {

  return new Promise(function (fulfill, reject) {
    var model   = mongoose.model('Link', linkSchema);

    // If a shortly was provided fulfill promise.

    var hasCustomShortly = newLink.hasOwnProperty('shortly');
    if(hasCustomShortly) return fulfill(newLink);

    model.findOne(newLink, function(err, link) {

      if(err) return reject(err);

      if(_.isEmpty(link)) return fulfill(newLink);

      newLink.shortly = link.shortly;
      fulfill(newLink);
    });

  });

}

/*
  Link#addShortly
    this function is used add a shortly if the object provided
    does not have one.
*/

linkSchema.statics.addShortly = function (newLink) {

  return new Promise(function (fulfill, reject) {
    var model   = mongoose.model('Link', linkSchema);

    // If a shortly was provided fulfill promise.

    var hasCustomShortly = newLink.hasOwnProperty('shortly');
    if(hasCustomShortly) return fulfill(newLink);

    // loop callback in which the method checks for the avai-
    // lability of the one created; it will resolve until it
    // finds an available one.

    var asyncLoop = function(o) {
      var data = {flag: false};

      var loop = function() {
        if(data.flag) {o.callback(data.shortly); return;}
        data.shortly = hashShortly();
        o.checkAvailableShortly(loop, data);
      }
      loop();
    }

    asyncLoop({
        checkAvailableShortly : function(loop, data) {
          setTimeout(function() {
            model.findOne({shortly: data.shortly}, function(err, link) {
              if(err)             return reject(err);
              if(_.isEmpty(link)) data.flag = true;
            });
            loop();
          }, 1);
        },
        callback : function(newShortly) {
          newLink.shortly = newShortly;
          return fulfill(newLink);
        }
    });

  });
}

/*
  Link#hashShortly
    function used to create a shortly using a dictionary based on
    base 64 adding also another extra valid url characters to it.
*/

function hashShortly() {
    return "a"
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

/*
  Link#createLink
    this function is used to check if there is already a link
    using the properties specified. If it exists, then it is
    returned via the fulfill promise, in the other case a new
    link document is created and returned.
*/

linkSchema.statics.createLink = function(newLink) {

  return new Promise(function (fulfill, reject) {
    var model   = mongoose.model('Link', linkSchema);

    model.findOne(newLink, function(err, link) {

      if(err) return reject(err);

      if(!_.isEmpty(link)) return fulfill(link);

      var newLinkDoc = new model(newLink);
      fulfill(newLinkDoc);
    });
  });
}



module.exports = mongoose.model('Link', linkSchema);
