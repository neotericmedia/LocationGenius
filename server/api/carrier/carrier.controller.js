'use strict';

var _ = require('lodash');
var Carrier = require('./carrier.model');
var request = require('request');



// Get a single carrier report
exports.show = function(req, res) {
  request({
    //url: 'http://10.117.192.55:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18&top=3000',
    url: 'http://192.99.16.178:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18&top=3000' ,
    //url: 'http://localhost:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18&top=100',
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

function handleError(res, err) {
  return res.send(500, err);
}
