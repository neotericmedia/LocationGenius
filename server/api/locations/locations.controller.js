'use strict';

var _ = require('lodash');
var Locations = require('./locations.model');
var request = require('request');



// Get list of locationss
exports.index = function(req, res) {
   request({
       url: 'http://192.99.16.178:9100/user/lgweb/location',
       //qs: {from: 'blog example', time: +new Date()}, //Query string data
       method: 'GET',
       headers: {
           'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
       }
   }, function(error, response, body){
       if(error) {
           console.log(error);
       } else {
           //console.log(body);
           res.send(body)
       }
   });

  // Locations.find(function (err, locationss) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, locationss);
  // });
};






// Get a single locations
exports.show = function(req, res) {
  Locations.findById(req.params.id, function (err, locations) {
    if(err) { return handleError(res, err); }
    if(!locations) { return res.send(404); }
    return res.json(locations);
  });
};

// Creates a new locations in the DB.
exports.create = function(req, res) {
  Locations.create(req.body, function(err, locations) {
    if(err) { return handleError(res, err); }
    return res.json(201, locations);
  });
};

// Updates an existing locations in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Locations.findById(req.params.id, function (err, locations) {
    if (err) { return handleError(res, err); }
    if(!locations) { return res.send(404); }
    var updated = _.merge(locations, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, locations);
    });
  });
};

// Deletes a locations from the DB.
exports.destroy = function(req, res) {
  Locations.findById(req.params.id, function (err, locations) {
    if(err) { return handleError(res, err); }
    if(!locations) { return res.send(404); }
    locations.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
