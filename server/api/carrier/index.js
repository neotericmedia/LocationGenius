'use strict';

var express = require('express');
var controller = require('./carrier.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id/:days', auth.isAuthenticated(), controller.show);

module.exports = router;
