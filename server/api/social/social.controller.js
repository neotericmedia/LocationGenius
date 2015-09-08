'use strict';

var _ = require('lodash');
var request = require('request');



// Get a twitter day report
// e.g.192.99.16.178:9100/twitter/dayreports/180?days=7&top=100
exports.show = function(req, res) {

  console.log('Getting twitter day report...' + req.query.days + " " + req.query.top);
  request({
    url: 'http://192.99.16.178:9100/twitter/dayreports/' + req.params.id + '?days=' + req.query.days + '&top=' + req.query.top,
    method: 'GET',
    headers: {
      'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      //console.log("Twitter Response:" + body);
      res.send(body)
    }

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
