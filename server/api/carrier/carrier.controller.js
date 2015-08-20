'use strict';

var _ = require('lodash');
var Carrier = require('./carrier.model');
var request = require('request');



// Get list of carriers
exports.index = function(req, res) {

   request({
       //url: 'http://54.86.239.240:7777/twitterdayreports/:locationId?days=:days&top=100', //URL to hit
       //url: 'http://54.86.239.240:7777/twitterdayreports/180?days=7&top=100', //URL to hit
       url: 'http://192.99.16.178:9100/carrier/180/7?endDate=2014-08-18',
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







// Get a single carrier
exports.show = function(req, res) {
  Carrier.findById(req.params.id, function (err, carrier) {
    if(err) { return handleError(res, err); }
    if(!carrier) { return res.send(404); }
    return res.json(carrier);
  });
};

// Creates a new carrier in the DB.
exports.create = function(req, res) {
  Carrier.create(req.body, function(err, carrier) {
    if(err) { return handleError(res, err); }
    return res.json(201, carrier);
  });
};

// Updates an existing carrier in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Carrier.findById(req.params.id, function (err, carrier) {
    if (err) { return handleError(res, err); }
    if(!carrier) { return res.send(404); }
    var updated = _.merge(carrier, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, carrier);
    });
  });
};

// Deletes a carrier from the DB.
exports.destroy = function(req, res) {
  Carrier.findById(req.params.id, function (err, carrier) {
    if(err) { return handleError(res, err); }
    if(!carrier) { return res.send(404); }
    carrier.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
