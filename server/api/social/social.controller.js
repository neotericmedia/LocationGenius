'use strict';

var _ = require('lodash');
var request = require('request');



// Get a twitter day report
// e.g.192.99.16.178:9100/twitter/dayreports/180?days=7&top=100
exports.show = function(req, res) {
  request({
    //url: 'http://10.117.192.55:9100/twitter/dayreports/' + req.params.id + '?days=' + req.query.days + '&top=' + req.query.top,
    url: 'http://localhost:9000/data/social.json',
    //url: 'http://localhost:9100/twitter/dayreports/' + req.params.id + '?days=' + req.query.days + '&top=' + req.query.top,
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


// Get tweets
// e.g.192.99.16.178:9100/twitter/dayreports/180?days=7&top=100
exports.tweeters = function(req, res) {
  request({
    url: 'http://10.117.192.55:9100/twitter/tweeters?days=' + req.query.days + '&top=' + req.query.top+ '&meters=' + req.query.meters + '&address=' + req.query.address,
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
