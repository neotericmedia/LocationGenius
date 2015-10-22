'use strict';

var _ = require('lodash');
var Carrier = require('./carrier.model');
var request = require('request');



// Get a single carrier report
exports.show = function(req, res) {
  console.log('Getting carrier report...' + req.query.endDate);
  request({
    //url: 'http://192.99.16.178:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18',
    url: 'http://192.99.16.178:8100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18',
    //url: 'http://localhost:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18',
    method: 'GET',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log("Carrier Response:" + body);
      res.send(body)
    }

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
