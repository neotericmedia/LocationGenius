'use strict';

var _ = require('lodash');
var Locations = require('./locationsPat.model');
var request = require('request');



// Get list of locationss
exports.index = function(req, res) {
   request({
       url: 'http://10.117.192.55:9100/user/Pattison/location',
       //url: 'http://192.99.16.178:9100/user/lgweb/location',
       //qs: {from: 'blog example', time: +new Date()}, //Query string data
       method: 'GET',
       headers: {
           'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
       }
   }, function(error, response, body){
       if(error) {
       } else {
           res.send(body)
       }
   });

  // Locations.find(function (err, locationss) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, locationss);
  // });
};






// Get a single locations
//@RequestMapping(value = "/{uid}/location/{id}", method= RequestMethod.GET)
//http://192.99.16.178:9101/user/lgweb/location/180
exports.show = function(req, res) {
  request({
    url: 'http://10.117.192.55:9100/user/' + req.params.userid + '/location/' + req.params.id,
    //url: 'http://192.99.16.178:9100/user/' + req.params.userid + '/location/' + req.params.id,
    method: 'GET',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    }
  }, function(error, response, body){
    if(error) {
    } else {
      res.send(body)
    }
  });

};

// Creates a new locations in the DB.
// Body Format
//{
//  "buildingId": "100",
//  "name": "Dave's Pizza",
//  "center": {
//  "longitude": "-79.263066",
//    "latitude": "43.77543"
//},
//  "searchRadiusMeters": 2000,
//  "address": "Oakville, ON M1P 5J1, Canada",
//  "uid": "lgweb"
//}
exports.create = function(req, res) {
  request({
    //url: 'http://localhost:9100/user/' + req.params.user + '/location',
    //url: 'http://192.99.16.178:9100/user/' + req.params.user + '/location',
    url: 'http://10.117.192.55:9100/user/' + req.params.user + '/location',
    method: 'POST',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    },
    body: req.body,
    json: true
  }, function(error, response, body){
    if(error) {
    } else {
      res.send(body)
    }
  });

};

// Updates an existing locations in the DB.
//@RequestMapping(value = "/{uid}/location/{id}", method= RequestMethod.PUT)
//http://localhost:9000/api/locations/lgweb/101
exports.update = function(req, res) {
  request({
    url: 'http://10.117.192.55:9100/user/' + req.params.userid + '/location/' + req.params.id,
    //url: 'http://192.99.16.178:9100/user/' + req.params.userid + '/location/' + req.params.id,
    //url: 'http://localhost:9100/user/' + req.params.userid + '/location/' + req.params.id,
    method: 'PUT',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    },
    body: req.body,
    json: true
  }, function(error, response, body){
    if(error) {
    } else {
      res.send(body)
    }
  });
};


// Deletes a locations from the DB.
//@RequestMapping(value = "/{uid}/location/{id}", method= RequestMethod.DELETE)
exports.destroy = function(req, res) {
  request({
    url: 'http://10.117.192.55:9100/user/' + req.params.userid + '/location/' + req.params.id,
    //url: 'http://192.99.16.178:9100/user/' + req.params.userid + '/location/' + req.params.id,
    //url: 'http://localhost:9100/user/' + req.params.userid + '/location/' + req.params.id,
    method: 'DELETE',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    }
  }, function(error, response, body){
    if(error) {
    } else {
      res.send(body)
    }
  });

};

function handleError(res, err) {
  return res.send(500, err);
}
