'use strict';

var _ = require('lodash');
var Onsite = require('./onsite.model');
var request = require('request');

// Get a onsite report
exports.show = function(req, res) {
  console.log("Date:" + req.query.date + " id:" + req.params.id );
  request({
    url: 'http://192.99.16.178:9100/onsitereport/' + req.params.id + '?date=' + req.query.date,
    //url: 'http://192.99.16.178:9100/onsitereport/180?date=2015-04-26',
    method: 'GET',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log("Onsite Response:" + response + " Output:" + body);
      res.send(body)
    }

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
