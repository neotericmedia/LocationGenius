'use strict';

var express = require('express');
var controller = require('./twitter.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/tweeters', auth.isAuthenticated(), controller.show);

module.exports = router;
