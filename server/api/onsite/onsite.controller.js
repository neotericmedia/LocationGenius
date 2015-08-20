'use strict';

var _ = require('lodash');
var Onsite = require('./onsite.model');
var request = require('request');


// Get list of onsites
exports.index = function(req, res) {

   request({
       //url: 'http://54.86.239.240:7777/twitterdayreports/:locationId?days=:days&top=100', //URL to hit
       //url: 'http://54.86.239.240:7777/twitterdayreports/180?days=7&top=100', //URL to hit
       //url: 'http://54.85.105.154:80/onsitereport/:buildingId?date=:dt',
       //url: 'http://192.99.16.178:9100/onsitereport/180?date=2015-04-02',
       url: 'http://192.99.16.178:9100/onsitereport/:buildingId?date=:dt',
       //var buildingId = req.body.user_id,
       //var dt = req.body.dt,
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




// Get a single onsite
exports.show = function(req, res) {
  Onsite.findById(req.params.id, function (err, onsite) {
    if(err) { return handleError(res, err); }
    if(!onsite) { return res.send(404); }
    return res.json(onsite);
  });
};

// Creates a new onsite in the DB.
exports.create = function(req, res) {
  Onsite.create(req.body, function(err, onsite) {
    if(err) { return handleError(res, err); }
    return res.json(201, onsite);
  });
};

// Updates an existing onsite in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Onsite.findById(req.params.id, function (err, onsite) {
    if (err) { return handleError(res, err); }
    if(!onsite) { return res.send(404); }
    var updated = _.merge(onsite, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, onsite);
    });
  });
};

// Deletes a onsite from the DB.
exports.destroy = function(req, res) {
  Onsite.findById(req.params.id, function (err, onsite) {
    if(err) { return handleError(res, err); }
    if(!onsite) { return res.send(404); }
    onsite.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
