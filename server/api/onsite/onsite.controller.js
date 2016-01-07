'use strict';

var _ = require('lodash');
var Onsite = require('./onsite.model');
var request = require('request');

// Get a onsite report
//http://192.99.16.178:9100/onsitereport/180?date=2015-04-26
//http://10.117.192.55:9111/multidays/108/2?endDate=2015-11-28
exports.show = function(req, res) {
  //var onsiteUrl = 'http://10.117.192.55:9111/multidays/' + req.params.id + '/7?endDate=' + req.query.date;
  var onsiteUrl = 'http://localhost:9000/data/onsite.json';

  request({

    //url: 'http://10.117.192.55:9111/multidays/108/2?endDate=2015-11-28',
    //url: 'http://10.117.192.55:9111/multidays/' + req.params.id + '/7?endDate=' + req.query.date,
    url: onsiteUrl,
    //url: 'http://kiteware.com/sensorReport2.json',
    //url: 'http://10.117.192.55:9100/onsitereport/' + req.params.id + '?date=' + req.query.date,

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
