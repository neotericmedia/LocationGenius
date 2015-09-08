'use strict';

var express = require('express');
var controller = require('./twitter.controller.js');

var router = express.Router();


router.get('/tweeters', controller.show);

module.exports = router;
