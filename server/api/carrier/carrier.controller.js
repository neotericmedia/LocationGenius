'use strict';

var _ = require('lodash');
var Carrier = require('./carrier.model');
var request = require('request');



// Get list of carriers
// exports.index = function(req, res) {
//    request({
//        url: 'http://192.99.16.178:9100/carrier/180/7?endDate=2014-08-18',
//        //url: 'http://192.99.16.178:9100/carrier/:buildingId/7',
//        //url: 'http://192.99.16.178:9100/onsitereport/:buildingId?date=:dt',
//        //url: 'data/outputsNetwork2.json',
//        method: 'GET',
//        headers: {
//            'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
//        }
//    }, function(error, response, body){
//        if(error) {
//            console.log(error);
//        } else {
//            //console.log(body);
//            res.send(body)
//        }
//    });
// };


// Get a single carrier report
exports.show = function(req, res) {
    console.log('Getting carrier report...');
    request({
       url: 'http://192.99.16.178:9100/carrier/' + req.params.id + '/' + req.params.days + '?endDate=2014-08-18',
       //url: 'http://192.99.16.178:9100/carrier/180/7?endDate=2014-08-18',
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
};




// Get a single carrier
// exports.show = function(req, res) {
//   Carrier.findById(req.params.id, function (err, carrier) {
//     if(err) { return handleError(res, err); }
//     if(!carrier) { return res.send(404); }
//     return res.json(carrier);
//   });
// };

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
