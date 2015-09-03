'use strict';

var express = require('express');
var controller = require('./carrier.controller');

var router = express.Router();

router.get('/:id/:days', controller.show);

module.exports = router;
