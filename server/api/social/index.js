'use strict';

var express = require('express');
var controller = require('./social.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/tweeters', auth.isAuthenticated(), controller.tweeters);

module.exports = router;
