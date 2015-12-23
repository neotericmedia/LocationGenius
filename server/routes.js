/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var https = require('https');
var http = require('http');
var url = require('url');
var request = require('request');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('2g8BY5TcNOtrI4FrcFqG0Q');





module.exports = function(app) {


  app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
  });

  var request = require('request');







  //mandrill
  app.post('/support', function(req, res) {
    var fromEmail = 'support@telus.com';
    var fromName = 'Telus Support Ticket';
    var toEmail = "doug@neotericmediainc.com";
    var toName = 'Admin';
    var replyTo = 'noreply@telus.com';
    var template_name = "Telus LG Support";
    var template_content = [{
            "name": "content",
            "content": "<p>Name:</p><p>" + req.body.name + "</p><p>Email:</p><p>" + req.body.email + "</p><p>Message:</p><p>" + req.body.message + "</p>"
        },
        {
            "name": "message",
            "content": req.body.message,
            "resident": req.body.resident
        }
        ];
    var message = {
      "html": "<p>Name:</p><p>" + req.body.name + "</p><p>Email:</p><p>" + req.body.email + "</p><p>Message:</p><p>" + req.body.message + "</p>",
      "text": req.body.message,
      //"subject": "Telus Support Ticket",
      "subject": req.body.subject,
      "from_email": fromEmail,
      "from_name": fromName,
      "to": [{
        "email": toEmail,
        "name": toName,
        "type": "to"
      }],
      //{
        //"email": toEmail,
        //"name": toName,
        //"type": "to"
      //}
      "headers": {
        "Reply-To": replyTo
      }
    };
    //mandrill_client.messages.send({"message": message, "async": async}, function(result) {
    mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message}, function(result) {
      console.log(result);
      //res.json(result);
      res.redirect('/success');
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
  })




  //mandrill
  app.post('/reset', function(req, res) {
    var fromEmail = 'support@telus.com';
    var fromName = 'Telus Password Reset Request';
    var toEmail = "doug@neotericmediainc.com";
    var toName = 'Admin';
    var replyTo = 'noreply@telus.com';
    var template_name = "Telus LG Password";
    var template_content = [{
            "name": "content",
            "content": "<p>Name:</p><p>" + req.body.name + "</p><p>Email:</p><p>" + req.body.email + "</p>"
        },
        {
            "name": "message",
            "content": req.body.message,
            "resident": req.body.resident
        }
        ];
    var message = {
      "html": "<p>Name:</p><p>" + req.body.name + "</p><p>Email:</p><p>" + req.body.email + "</p><p>Message:</p><p>" + req.body.message + "</p>",
      "text": req.body.message,
      //"subject": "Telus Support Ticket",
      "subject": req.body.subject,
      "from_email": fromEmail,
      "from_name": fromName,
      "to": [{
        "email": toEmail,
        "name": toName,
        "type": "to"
      }],
      //{
        //"email": toEmail,
        //"name": toName,
        //"type": "to"
      //}
      //],
      "headers": {
        "Reply-To": replyTo
      }
    };
    mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message}, function(result) {
      console.log(result);
      //res.json(result);
      //res.redirect('/success2');
    }, function(e) {
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });

  })














  // Insert routes below
  app.use('/api/onsite', require('./api/onsite'));
  app.use('/api/carrier', require('./api/carrier'));
  app.use('/api/social', require('./api/social'));
  app.use('/api/twitter', require('./api/twitter'));
  app.use('/api/locationsLG', require('./api/locationsLG'));
  app.use('/api/locationsTit', require('./api/locationsTit'));
  app.use('/api/locationsPat', require('./api/locationsPat'));
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
