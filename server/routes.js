/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var https = require('https');
var http = require('http');
var url = require('url');
var request = require('request');





// request('https://modulus.io', function (error, response, body) {
//     //Check for error
//     if(error){
//         return console.log('Error:', error);
//     }
//     //Check for right status code
//     if(response.statusCode !== 200){
//         return console.log('Invalid Status Code Returned:', response.statusCode);
//     }
//     //All is good. Print the body
//     console.log(body); // Show the HTML for the Modulus homepage.
// });



   // request({
   //     //url: 'http://54.86.239.240:7777/twitterdayreports/:locationId?days=:days&top=100', //URL to hit
   //     //url: 'http://54.86.239.240:7777/twitterdayreports/180?days=7&top=100', //URL to hit
   //     url: 'http://52.3.87.216:9100/user/lgweb/location',
   //     //qs: {from: 'blog example', time: +new Date()}, //Query string data
   //     method: 'GET',
   //     headers: {
   //         'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw=='
   //     }
   // }, function(error, response, body){
   //     if(error) {
   //         console.log(error);
   //     } else {
   //         console.log(body);
   //         //res.send(body)
   //     }
   // });




module.exports = function(app) {


  app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
  });



  // Insert routes below
  app.use('/api/locations', require('./api/locations'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
