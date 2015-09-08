'use strict';

var express = require('express');
var controller = require('./social.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.get('/tweeters', controller.tweeters);

module.exports = router;
